'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Heart,
  Home,
  Users,
  Clock,
  Plus,
  Search,
  Filter,
  X,
  Edit,
  Trash2,
  Download,
  Info,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {
  BLOOD_GROUPS,
  BLOOD_GROUP_COLORS,
  GENDERS,
  Donor,
  DonationRecord,
  ScheduledDonation,
  BloodGroup,
} from '@/lib/blood-data';
import { createClient } from '@/lib/supabase/client';

type Tab = 'home' | 'donors' | 'schedule' | 'history';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'];

export default function BloodDonorApp() {
  const supabase = createClient();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>([]);
  const [scheduledDonations, setScheduledDonations] = useState<ScheduledDonation[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState<BloodGroup | ''>('');
  const [filterArea, setFilterArea] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '' as BloodGroup | '',
    phoneNumber: '',
    email: '',
    area: '',
    gender: '',
    dateOfBirth: '',
  });

  const [recordData, setRecordData] = useState({
    donationDate: '',
    volume: '',
    location: '',
    notes: '',
  });

  const [scheduledData, setScheduledData] = useState({
    scheduledDate: '',
    location: '',
    notes: '',
  });

  // Load donors from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data: donorsData, error: donorsError } = await supabase
          .from('donors')
          .select('*');

        if (donorsError) throw donorsError;

        const { data: recordsData, error: recordsError } = await supabase
          .from('donation_records')
          .select('*');

        if (recordsError) throw recordsError;

        const { data: scheduledData, error: scheduledError } = await supabase
          .from('scheduled_donations')
          .select('*');

        if (scheduledError) throw scheduledError;

        setDonors(donorsData || []);
        setDonationRecords(recordsData || []);
        setScheduledDonations(scheduledData || []);

        // Show onboarding only if no donors exist
        if (!donorsData || donorsData.length === 0) {
          const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
          if (!hasSeenOnboarding) {
            setShowOnboarding(true);
            localStorage.setItem('hasSeenOnboarding', 'true');
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        showToast('Error loading data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addDonor = async () => {
    if (!formData.name || !formData.bloodGroup || !formData.phoneNumber || !formData.area || !formData.gender) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('donors')
        .insert([
          {
            name: formData.name,
            blood_group: formData.bloodGroup,
            phone_number: formData.phoneNumber,
            email: formData.email || null,
            area: formData.area,
            gender: formData.gender,
            date_of_birth: formData.dateOfBirth || null,
            is_available: true,
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        const newDonor: Donor = {
          id: data[0].id,
          name: data[0].name,
          bloodGroup: data[0].blood_group,
          phoneNumber: data[0].phone_number,
          email: data[0].email,
          area: data[0].area,
          gender: data[0].gender,
          dateOfBirth: data[0].date_of_birth,
          lastDonationDate: data[0].last_donation_date,
          totalDonations: data[0].total_donations,
          isAvailable: data[0].is_available,
          createdAt: data[0].created_at,
        };

        setDonors([...donors, newDonor]);
        setFormData({
          name: '',
          bloodGroup: '',
          phoneNumber: '',
          email: '',
          area: '',
          gender: '',
          dateOfBirth: '',
        });
        setShowAddDonor(false);
        showToast('Donor added successfully', 'success');
      }
    } catch (error) {
      console.error('Error adding donor:', error);
      showToast('Error adding donor', 'error');
    }
  };

  const updateDonor = async () => {
    if (!editingDonor) return;

    if (!formData.name || !formData.bloodGroup || !formData.phoneNumber || !formData.area || !formData.gender) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('donors')
        .update({
          name: formData.name,
          blood_group: formData.bloodGroup,
          phone_number: formData.phoneNumber,
          email: formData.email || null,
          area: formData.area,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth || null,
        })
        .eq('id', editingDonor.id);

      if (error) throw error;

      setDonors(
        donors.map(d =>
          d.id === editingDonor.id
            ? {
                ...d,
                name: formData.name,
                bloodGroup: formData.bloodGroup as BloodGroup,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                area: formData.area,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth,
              }
            : d
        )
      );

      setEditingDonor(null);
      setShowAddDonor(false);
      setFormData({
        name: '',
        bloodGroup: '',
        phoneNumber: '',
        email: '',
        area: '',
        gender: '',
        dateOfBirth: '',
      });
      showToast('Donor updated successfully', 'success');
    } catch (error) {
      console.error('Error updating donor:', error);
      showToast('Error updating donor', 'error');
    }
  };

  const deleteDonor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDonors(donors.filter(d => d.id !== id));
      setShowDetailModal(false);
      showToast('Donor deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting donor:', error);
      showToast('Error deleting donor', 'error');
    }
  };

  const addDonationRecord = async () => {
    if (!selectedDonor || !recordData.donationDate || !recordData.volume || !recordData.location) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('donation_records')
        .insert([
          {
            donor_id: selectedDonor.id,
            donation_date: recordData.donationDate,
            blood_group: selectedDonor.bloodGroup,
            volume: parseInt(recordData.volume),
            location: recordData.location,
            notes: recordData.notes || null,
          },
        ]);

      if (error) throw error;

      // Update donor's last donation date and total donations
      const updatedDonors = donors.map(d =>
        d.id === selectedDonor.id
          ? {
              ...d,
              lastDonationDate: recordData.donationDate,
              totalDonations: d.totalDonations + 1,
            }
          : d
      );
      setDonors(updatedDonors);
      setSelectedDonor(updatedDonors.find(d => d.id === selectedDonor.id) || null);

      // Reload donation records
      const { data: recordsData } = await supabase
        .from('donation_records')
        .select('*');
      setDonationRecords(recordsData || []);

      setRecordData({ donationDate: '', volume: '', location: '', notes: '' });
      setShowAddRecord(false);
      showToast('Donation record added successfully', 'success');
    } catch (error) {
      console.error('Error adding donation record:', error);
      showToast('Error adding donation record', 'error');
    }
  };

  const addScheduledDonation = async () => {
    if (!selectedDonor || !scheduledData.scheduledDate || !scheduledData.location) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('scheduled_donations')
        .insert([
          {
            donor_id: selectedDonor.id,
            scheduled_date: scheduledData.scheduledDate,
            blood_group: selectedDonor.bloodGroup,
            status: 'pending',
            location: scheduledData.location,
            notes: scheduledData.notes || null,
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        setScheduledDonations([
          ...scheduledDonations,
          {
            id: data[0].id,
            donorId: data[0].donor_id,
            scheduledDate: data[0].scheduled_date,
            bloodGroup: data[0].blood_group,
            status: data[0].status,
            location: data[0].location,
            notes: data[0].notes,
            createdAt: data[0].created_at,
          },
        ]);
      }

      setScheduledData({ scheduledDate: '', location: '', notes: '' });
      showToast('Scheduled donation added successfully', 'success');
    } catch (error) {
      console.error('Error adding scheduled donation:', error);
      showToast('Error adding scheduled donation', 'error');
    }
  };

  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const matchesSearch =
        donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.phoneNumber.includes(searchQuery) ||
        donor.area.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBloodGroup = !filterBloodGroup || donor.bloodGroup === filterBloodGroup;
      const matchesArea = !filterArea || donor.area.toLowerCase().includes(filterArea.toLowerCase());
      const matchesGender = !filterGender || donor.gender === filterGender;

      return matchesSearch && matchesBloodGroup && matchesArea && matchesGender;
    });
  }, [donors, searchQuery, filterBloodGroup, filterArea, filterGender]);

  const bloodGroupStats = useMemo(() => {
    const stats: { name: string; value: number }[] = [];
    BLOOD_GROUPS.forEach(bg => {
      const count = donors.filter(d => d.bloodGroup === bg).length;
      stats.push({ name: bg, value: count });
    });
    return stats.filter(s => s.value > 0);
  }, [donors]);

  const onboardingSlides = [
    {
      title: 'Welcome to Blood Donor Network',
      description: 'Connect with blood donors in your community and help save lives.',
      icon: Heart,
    },
    {
      title: 'Manage Donors',
      description: 'Add, view, and manage blood donor information easily.',
      icon: Users,
    },
    {
      title: 'Track Donations',
      description: 'Record donations and schedule future donation drives.',
      icon: Clock,
    },
  ];

  const openEditDonor = (donor: Donor) => {
    setEditingDonor(donor);
    setFormData({
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      phoneNumber: donor.phoneNumber,
      email: donor.email || '',
      area: donor.area,
      gender: donor.gender,
      dateOfBirth: donor.dateOfBirth || '',
    });
    setShowAddDonor(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-red-500 animate-pulse mx-auto mb-2" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 fill-current" />
          <h1 className="text-xl font-bold">Blood Donor Network</h1>
        </div>
        <button
          onClick={() => setShowOnboarding(true)}
          className="p-2 hover:bg-red-600 rounded-lg transition-colors"
          title="Help"
        >
          <Info className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* Home Tab */}
        {currentTab === 'home' && (
          <div className="space-y-6 p-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Total Donors</p>
                <p className="text-2xl font-bold text-blue-600">{donors.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                <p className="text-gray-600 text-sm">Available</p>
                <p className="text-2xl font-bold text-green-600">{donors.filter(d => d.isAvailable).length}</p>
              </div>
            </div>

            {/* Blood Group Chart */}
            {bloodGroupStats.length > 0 && (
              <div className="bg-white border rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Blood Group Distribution</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={bloodGroupStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bloodGroupStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white border rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Stats</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Total Donations Recorded: {donationRecords.length}</p>
                <p>✓ Scheduled Donations: {scheduledDonations.filter(s => s.status === 'pending').length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Donors Tab */}
        {currentTab === 'donors' && (
          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or area"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <button className="flex items-center gap-2 w-full text-left" onClick={() => {}}>
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
              <div className="grid grid-cols-1 gap-2">
                <select
                  value={filterBloodGroup}
                  onChange={e => setFilterBloodGroup(e.target.value as BloodGroup | '')}
                  className="border rounded-lg p-2 text-sm"
                >
                  <option value="">All Blood Groups</option>
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Filter by Area"
                  value={filterArea}
                  onChange={e => setFilterArea(e.target.value)}
                  className="border rounded-lg p-2 text-sm"
                />

                <select
                  value={filterGender}
                  onChange={e => setFilterGender(e.target.value)}
                  className="border rounded-lg p-2 text-sm"
                >
                  <option value="">All Genders</option>
                  {GENDERS.map(g => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Donor List */}
            <div className="space-y-2">
              {filteredDonors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No donors found</p>
                </div>
              ) : (
                filteredDonors.map(donor => (
                  <button
                    key={donor.id}
                    onClick={() => {
                      setSelectedDonor(donor);
                      setShowDetailModal(true);
                    }}
                    className="w-full bg-white border rounded-lg p-3 text-left hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{donor.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <span
                            className="px-2 py-1 rounded text-xs font-semibold text-white"
                            style={{ backgroundColor: BLOOD_GROUP_COLORS[donor.bloodGroup] }}
                          >
                            {donor.bloodGroup}
                          </span>
                          <span className="text-xs text-gray-500">{donor.area}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${donor.isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                        {donor.isAvailable ? '✓ Available' : 'Not Available'}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {currentTab === 'schedule' && (
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Scheduled Donations</h2>
            {scheduledDonations.filter(s => s.status === 'pending').length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No scheduled donations</p>
              </div>
            ) : (
              <div className="space-y-2">
                {scheduledDonations
                  .filter(s => s.status === 'pending')
                  .map(scheduled => {
                    const donor = donors.find(d => d.id === scheduled.donorId);
                    return (
                      <div key={scheduled.id} className="bg-white border rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">{donor?.name}</h3>
                            <p className="text-sm text-gray-600">{scheduled.scheduledDate}</p>
                            <p className="text-xs text-gray-500 mt-1">{scheduled.location}</p>
                          </div>
                          <span
                            className="px-2 py-1 rounded text-xs font-semibold text-white"
                            style={{ backgroundColor: BLOOD_GROUP_COLORS[scheduled.bloodGroup] }}
                          >
                            {scheduled.bloodGroup}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {currentTab === 'history' && (
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Donation Records</h2>
            {donationRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Download className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No donation records</p>
              </div>
            ) : (
              <div className="space-y-2">
                {donationRecords.map(record => {
                  const donor = donors.find(d => d.id === record.donor_id);
                  return (
                    <div key={record.id} className="bg-white border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{donor?.name}</h3>
                          <p className="text-sm text-gray-600">{record.donation_date}</p>
                          <p className="text-xs text-gray-500 mt-1">{record.location} • {record.volume}ml</p>
                          {record.notes && <p className="text-xs text-gray-400 mt-1">{record.notes}</p>}
                        </div>
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold text-white"
                          style={{ backgroundColor: BLOOD_GROUP_COLORS[record.blood_group as BloodGroup] }}
                        >
                          {record.blood_group}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {currentTab === 'donors' && (
        <button
          onClick={() => {
            setEditingDonor(null);
            setFormData({
              name: '',
              bloodGroup: '',
              phoneNumber: '',
              email: '',
              area: '',
              gender: '',
              dateOfBirth: '',
            });
            setShowAddDonor(true);
          }}
          className="fixed bottom-24 right-4 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-lg">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center p-2 ${currentTab === 'home' ? 'text-red-600' : 'text-gray-600'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => setCurrentTab('donors')}
          className={`flex flex-col items-center p-2 ${currentTab === 'donors' ? 'text-red-600' : 'text-gray-600'}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">Donors</span>
        </button>
        <button
          onClick={() => setCurrentTab('schedule')}
          className={`flex flex-col items-center p-2 ${currentTab === 'schedule' ? 'text-red-600' : 'text-gray-600'}`}
        >
          <Clock className="w-6 h-6" />
          <span className="text-xs mt-1">Schedule</span>
        </button>
        <button
          onClick={() => setCurrentTab('history')}
          className={`flex flex-col items-center p-2 ${currentTab === 'history' ? 'text-red-600' : 'text-gray-600'}`}
        >
          <Download className="w-6 h-6" />
          <span className="text-xs mt-1">History</span>
        </button>
      </nav>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6">
            <button
              onClick={() => setShowOnboarding(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              {React.createElement(onboardingSlides[onboardingStep].icon, {
                className: 'w-16 h-16 mx-auto text-red-600',
              })}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{onboardingSlides[onboardingStep].title}</h2>
                <p className="text-gray-600 mt-2">{onboardingSlides[onboardingStep].description}</p>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              {onboardingSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setOnboardingStep(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === onboardingStep ? 'bg-red-600 w-6' : 'bg-gray-300'}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (onboardingStep > 0) setOnboardingStep(onboardingStep - 1);
                }}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  onboardingStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                disabled={onboardingStep === 0}
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (onboardingStep < onboardingSlides.length - 1) {
                    setOnboardingStep(onboardingStep + 1);
                  } else {
                    setShowOnboarding(false);
                  }
                }}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {onboardingStep === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Donor Modal */}
      {showAddDonor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{editingDonor ? 'Edit Donor' : 'Add New Donor'}</h2>
              <button
                onClick={() => {
                  setShowAddDonor(false);
                  setEditingDonor(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg p-2"
              />

              <select
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup | '' })}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select Blood Group *</option>
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>

              <input
                type="tel"
                placeholder="Phone Number *"
                value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full border rounded-lg p-2"
              />

              <input
                type="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded-lg p-2"
              />

              <input
                type="text"
                placeholder="Area/Location *"
                value={formData.area}
                onChange={e => setFormData({ ...formData, area: e.target.value })}
                className="w-full border rounded-lg p-2"
              />

              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select Gender *</option>
                {GENDERS.map(g => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <input
                type="date"
                placeholder="Date of Birth (optional)"
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddDonor(false);
                  setEditingDonor(null);
                }}
                className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingDonor ? updateDonor : addDonor}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {editingDonor ? 'Update' : 'Add'} Donor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donor Detail Modal */}
      {showDetailModal && selectedDonor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{selectedDonor.name}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Blood Group</span>
                <span
                  className="px-3 py-1 rounded font-semibold text-white"
                  style={{ backgroundColor: BLOOD_GROUP_COLORS[selectedDonor.bloodGroup] }}
                >
                  {selectedDonor.bloodGroup}
                </span>
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">{selectedDonor.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Area</span>
                  <span className="font-medium">{selectedDonor.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-medium">{selectedDonor.gender}</span>
                </div>
                {selectedDonor.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium text-sm">{selectedDonor.email}</span>
                  </div>
                )}
                {selectedDonor.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">DOB</span>
                    <span className="font-medium">{selectedDonor.dateOfBirth}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Donations</span>
                  <span className="font-medium">{selectedDonor.totalDonations}</span>
                </div>
                {selectedDonor.lastDonationDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Donation</span>
                    <span className="font-medium">{selectedDonor.lastDonationDate}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-3">
                <h3 className="font-semibold text-gray-800 mb-2">Donation History</h3>
                {donationRecords.filter(r => r.donor_id === selectedDonor.id).length === 0 ? (
                  <p className="text-sm text-gray-500">No donation records</p>
                ) : (
                  <div className="space-y-2">
                    {donationRecords
                      .filter(r => r.donor_id === selectedDonor.id)
                      .map(record => (
                        <div key={record.id} className="text-sm bg-gray-50 p-2 rounded">
                          <p className="font-medium">{record.donation_date}</p>
                          <p className="text-gray-600">{record.volume}ml • {record.location}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => {
                  setShowAddRecord(true);
                }}
                className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Add Record
              </button>
              <button
                onClick={() => openEditDonor(selectedDonor)}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteDonor(selectedDonor.id)}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Donation Record Modal */}
      {showAddRecord && selectedDonor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Add Donation Record</h2>
              <button
                onClick={() => setShowAddRecord(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="date"
                value={recordData.donationDate}
                onChange={e => setRecordData({ ...recordData, donationDate: e.target.value })}
                className="w-full border rounded-lg p-2"
                placeholder="Donation Date *"
              />

              <input
                type="number"
                value={recordData.volume}
                onChange={e => setRecordData({ ...recordData, volume: e.target.value })}
                className="w-full border rounded-lg p-2"
                placeholder="Volume (ml) *"
              />

              <input
                type="text"
                value={recordData.location}
                onChange={e => setRecordData({ ...recordData, location: e.target.value })}
                className="w-full border rounded-lg p-2"
                placeholder="Location *"
              />

              <textarea
                value={recordData.notes}
                onChange={e => setRecordData({ ...recordData, notes: e.target.value })}
                className="w-full border rounded-lg p-2"
                placeholder="Notes (optional)"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddRecord(false)}
                className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addDonationRecord}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-24 left-4 right-4 p-4 rounded-lg text-white text-center ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
