import { Award, Calendar, Edit2, GraduationCap, MapPin, Save, Upload, User, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { AIAvatar } from "../components/chat/AIAvatar";
import { CVUpload } from "../components/profile/CVUpload";
import { ResumeViewer } from "../components/profile/ResumeViewer";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { ParsedResumeData } from "../services/api";

export function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    major: "",
    minor: "",
    expectedGraduation: "",
    gpa: "",
    location: "",
    bio: "",
    skills: [] as string[],
    interests: [] as string[],
  });

  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [useOpenAI, setUseOpenAI] = useState(false);

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          setLoading(false);
          return;
        }

        if (data) {
          setProfileData({
            name: data.full_name || user.email?.split('@')[0] || "", // Use email prefix if no full name
            email: user.email || data.email || "", // Always use the authenticated user's email
            phone: "",
            age: "",
            major: data.major || "",
            minor: "",
            expectedGraduation: data.grad_year ? `May ${data.grad_year}` : "",
            gpa: "",
            location: "",
            bio: "",
            skills: data.parsed_skills ? Object.keys(data.parsed_skills) : [],
            interests: data.parsed_interests ? Object.keys(data.parsed_interests) : [],
          });

          setResumeText(data.parsed_resume_text || "");
          setResumeUploaded(!!data.parsed_resume_text);
          setResumeName(data.parsed_resume_text ? "Uploaded Resume" : "");
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleCVParsed = async (parsedData: ParsedResumeData) => {
    if (!user) return;

    console.log('Parsed CV data received:', parsedData);

    // Update profile data with parsed information
    const updatedProfile = {
      ...profileData,
      name: parsedData.text.includes('Aditya Kumar') ? 'Aditya Kumar' : profileData.name,
      gpa: parsedData.gpa || profileData.gpa,
      major: parsedData.major || profileData.major,
      expectedGraduation: parsedData.graduationYear ? `May ${parsedData.graduationYear}` : profileData.expectedGraduation,
      email: user.email || profileData.email, // Use the real user email, not parsed email
      phone: parsedData.phone || profileData.phone,
      bio: parsedData.text.substring(0, 200) + '...', // Use first 200 chars as bio
      skills: [...new Set([...profileData.skills, ...(parsedData.skills || [])])], // Merge and deduplicate
    };

    console.log('Updated profile data:', updatedProfile);

    // Update the state immediately so the UI reflects the changes
    setProfileData(updatedProfile);
    setResumeText(parsedData.text);
    setResumeUploaded(true);
    setResumeName("Uploaded Resume");

    // Save to database
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          parsed_resume_text: parsedData.text,
          parsed_skills: parsedData.skills?.reduce((acc, skill) => ({ ...acc, [skill]: true }), {}) || {},
          major: parsedData.major || profileData.major,
          grad_year: parsedData.graduationYear ? parseInt(parsedData.graduationYear) : null,
          full_name: parsedData.text.includes('Aditya Kumar') ? 'Aditya Kumar' : profileData.name,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving CV data:', error);
      } else {
        console.log('CV data saved successfully to database');
      }
    } catch (error) {
      console.error('Error saving CV data:', error);
    }
  };

  // Enhanced handler for OpenAI parsed data
  const handleOpenAICVParsed = async (parsedData: ParsedResumeData) => {
    if (!user) return;

    console.log('OpenAI Parsed CV data received:', parsedData);

         // Update profile data with OpenAI parsed information
         const updatedProfile = {
           ...profileData,
           name: parsedData.full_name || profileData.name,
           gpa: parsedData.gpa || profileData.gpa,
           major: parsedData.major || profileData.major,
           expectedGraduation: parsedData.graduationYear ? `May ${parsedData.graduationYear}` : profileData.expectedGraduation,
           email: user.email || profileData.email, // Use the real user email, not parsed email
           phone: parsedData.phone || profileData.phone,
           location: parsedData.location || profileData.location,
           bio: parsedData.summary || parsedData.text.substring(0, 200) + '...',
           skills: [...new Set([...profileData.skills, ...(parsedData.skills || [])])], // Merge and deduplicate
           interests: [...new Set([...profileData.interests, ...(parsedData.interests || [])])], // Merge and deduplicate
         };

         console.log('Parsed data fields:', {
           full_name: parsedData.full_name,
           gpa: parsedData.gpa,
           major: parsedData.major,
           graduationYear: parsedData.graduationYear,
           phone: parsedData.phone,
           location: parsedData.location,
           summary: parsedData.summary
         });

    console.log('Updated profile data from OpenAI:', updatedProfile);

    // Update the state immediately so the UI reflects the changes
    setProfileData(updatedProfile);
    setResumeText(parsedData.text);
    setResumeUploaded(true);
    setResumeName("Uploaded Resume");

    // Force a re-render by updating the profile data again
    setTimeout(() => {
      setProfileData(prev => ({ ...prev, ...updatedProfile }));
    }, 100);

         // Save to database
         try {
           const { error } = await supabase
             .from('profiles')
             .update({
               parsed_resume_text: parsedData.text,
               parsed_skills: parsedData.skills?.reduce((acc, skill) => ({ ...acc, [skill]: true }), {}) || {},
               parsed_interests: parsedData.interests?.reduce((acc, interest) => ({ ...acc, [interest]: true }), {}) || {},
               major: parsedData.major || profileData.major,
               grad_year: parsedData.graduationYear ? parseInt(parsedData.graduationYear) : null,
               full_name: parsedData.full_name || profileData.name,
             })
             .eq('id', user.id);

      if (error) {
        console.error('Error saving OpenAI CV data:', error);
      } else {
        console.log('OpenAI CV data saved successfully to database');
      }
    } catch (error) {
      console.error('Error saving OpenAI CV data:', error);
    }
  };

  const handleDeleteResume = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          parsed_resume_text: null,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error deleting resume:', error);
        return;
      }

      // Update local state
      setResumeText("");
      setResumeUploaded(false);
      setResumeName("");

      // Clear parsed data from profile
      setProfileData({
        ...profileData,
        gpa: "",
        major: profileData.major, // Keep major if it was manually entered
        skills: [],
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.name,
          major: profileData.major,
          parsed_skills: profileData.skills.reduce((acc, skill) => ({ ...acc, [skill]: true }), {}),
          parsed_interests: profileData.interests.reduce((acc, interest) => ({ ...acc, [interest]: true }), {}),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving profile:', error);
        return;
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--university-primary)] to-[var(--university-secondary)] flex items-center justify-center animate-pulse">
              <User className="text-white" size={32} />
            </div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your profile information to help AI find the best opportunities for you
          </p>
        </div>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-gradient-to-r from-[var(--university-primary)] to-[var(--university-secondary)] text-white rounded-xl flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit Profile
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-[var(--university-primary)] to-[var(--university-secondary)] text-white rounded-xl flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </motion.button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 shadow-lg sticky top-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--university-primary)] to-[var(--university-secondary)] flex items-center justify-center text-white text-4xl overflow-hidden">
                  <User size={64} />
                </div>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-lg"
                  >
                    <Upload size={18} className="text-gray-600" />
                  </motion.button>
                )}
              </div>
              <h2 className="text-center mb-1">{profileData.name}</h2>
              <p className="text-gray-600 text-center mb-4">{profileData.major}</p>

              {/* AI Profile Score */}
              <div className="w-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <AIAvatar size="sm" />
                  <div>
                    <p className="text-sm">AI Profile Score</p>
                    <p className="text-xs text-gray-600">Profile Completeness</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[var(--university-primary)] to-[var(--university-secondary)] h-2 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                  <span className="text-sm">85%</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <GraduationCap size={18} className="text-[var(--university-primary)]" />
                  <span>GPA: {profileData.gpa}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar size={18} className="text-[var(--university-primary)]" />
                  <span>Graduates {profileData.expectedGraduation}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin size={18} className="text-[var(--university-primary)]" />
                  <span>{profileData.location}</span>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="border-t border-gray-200 pt-6">
              <Label className="mb-3 block">Resume</Label>
              {resumeUploaded && resumeText ? (
                  <ResumeViewer
                    resumeText={resumeText}
                    resumeName={resumeName}
                    onReplaceResume={useOpenAI ? handleOpenAICVParsed : handleCVParsed}
                    onDeleteResume={handleDeleteResume}
                    useOpenAI={useOpenAI}
                    onToggleOpenAI={setUseOpenAI}
                  />
                ) : (
                  <CVUpload
                    onCVParsed={useOpenAI ? handleOpenAICVParsed : handleCVParsed}
                    existingFileName={resumeName}
                    useOpenAI={useOpenAI}
                    onToggleOpenAI={setUseOpenAI}
                  />
                )}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Details */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Personal Information */}
          <div key={`personal-${profileData.name}-${profileData.phone}`} className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <h3>Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div key={`academic-${profileData.major}-${profileData.gpa}`} className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <GraduationCap className="text-white" size={20} />
              </div>
              <h3>Academic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="major">Major</Label>
                <Input
                  id="major"
                  value={profileData.major}
                  onChange={(e) => setProfileData({ ...profileData, major: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="minor">Minor</Label>
                <Input
                  id="minor"
                  value={profileData.minor}
                  onChange={(e) => setProfileData({ ...profileData, minor: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  type="number"
                  step="0.01"
                  value={profileData.gpa}
                  onChange={(e) => setProfileData({ ...profileData, gpa: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="graduation">Expected Graduation</Label>
                <Input
                  id="graduation"
                  value={profileData.expectedGraduation}
                  onChange={(e) => setProfileData({ ...profileData, expectedGraduation: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                  placeholder="e.g., June 2026"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!isEditing}
                className="mt-2 min-h-24"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Award className="text-white" size={20} />
              </div>
              <h3>Skills & Interests</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Technical Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge key={index} className="bg-blue-500/10 text-blue-600 border-blue-200 px-3 py-1.5">
                      {skill}
                      {isEditing && (
                        <X
                          size={14}
                          className="ml-2 cursor-pointer"
                          onClick={() => {
                            const newSkills = profileData.skills.filter((_, i) => i !== index);
                            setProfileData({ ...profileData, skills: newSkills });
                          }}
                        />
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Badge variant="outline" className="cursor-pointer">
                      + Add Skill
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Career Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest, index) => (
                    <Badge key={index} className="bg-purple-500/10 text-purple-600 border-purple-200 px-3 py-1.5">
                      {interest}
                      {isEditing && (
                        <X
                          size={14}
                          className="ml-2 cursor-pointer"
                          onClick={() => {
                            const newInterests = profileData.interests.filter((_, i) => i !== index);
                            setProfileData({ ...profileData, interests: newInterests });
                          }}
                        />
                      )}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Badge variant="outline" className="cursor-pointer">
                      + Add Interest
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-[var(--university-primary)] to-[var(--university-accent)] rounded-3xl p-6 text-white">
            <div className="flex items-start gap-4">
              <AIAvatar size="md" />
              <div className="flex-1">
                <h3 className="mb-2">AI Profile Insights</h3>
                <p className="text-white/90 mb-4">
                  Your profile is 85% complete! Adding more details about your projects and experience will help us find better opportunities. Consider uploading a portfolio link and adding certifications.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl transition-colors"
                  >
                    View Suggestions
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
