import { useMemo, useRef, useState } from 'react';
import { AlertCircle, BadgeCheck, CheckCircle2, ChevronLeft, ChevronRight, FileText, Trash2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ApplicantFormData } from '@/components/careers/shared/types';
import { supabase } from '@/lib/supabase';
import { uploadResumeFile, validateResumeFile, deleteResumeFile } from '@/lib/storage';

type ApplicationWizardProps = {
  onSubmit: (data: ApplicantFormData) => void;
  initialData?: ApplicantFormData;
};

const initialFormState: ApplicantFormData = {
  fullName: '',
  email: '',
  mobile: '',
  dateOfBirth: '',
  gender: '',
  country: '',
  state: '',
  city: '',
  postalCode: '',
  address: '',
  qualification: '',
  college: '',
  university: '',
  percentage: '',
  passingYear: '',
  experience: '',
  skills: '',
  portfolio: '',
  linkedIn: '',
  resumePath: '',
  declarationAccepted: false,
};

const steps = [
  { title: 'Personal', description: 'Tell us about you' },
  { title: 'Address', description: 'Where you live' },
  { title: 'Education', description: 'Academic background' },
  { title: 'Professional', description: 'Work and skills' },
  { title: 'Declaration', description: 'Confirm your details' },
];

export function ApplicationWizard({ onSubmit, initialData }: ApplicationWizardProps) {
  const [formData, setFormData] = useState<ApplicantFormData>({ ...initialFormState, ...initialData });
  const [activeStep, setActiveStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);

  const updateField = (field: keyof ApplicantFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUploadError('Unauthenticated user. Please verify your email first.');
        setUploading(false);
        return;
      }

      const result = await uploadResumeFile(file, user.id, formData.resumePath);
      if (result.error || !result.path) {
        setUploadError(result.error || 'Failed to upload resume.');
      } else {
        updateField('resumePath', result.path);
        setUploadedFileName(file.name);
        setUploadError(null);
      }
    } catch (err: any) {
      console.error('File selection upload error:', err);
      setUploadError(err.message || 'Error uploading file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveResume = async () => {
    if (formData.resumePath) {
      await deleteResumeFile(formData.resumePath);
      updateField('resumePath', '');
      setUploadedFileName(null);
    }
    setUploadError(null);
  };

  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Card className="border-slate-200 bg-white shadow-md rounded-2xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl font-semibold text-slate-900">Application form</CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-600">
              {steps[activeStep].description}
            </CardDescription>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
            Step {activeStep + 1} of {steps.length}
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <BadgeCheck key={step.title} className={`h-4 w-4 ${index <= activeStep ? 'text-slate-900' : 'text-slate-300'}`} />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {activeStep === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Full name</label>
              <Input value={formData.fullName} onChange={(event) => updateField('fullName', event.target.value)} placeholder="Enter your full name" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} placeholder="Enter your email address" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Mobile</label>
              <Input value={formData.mobile} onChange={(event) => updateField('mobile', event.target.value)} placeholder="Enter your mobile number" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date of birth</label>
              <Input type="date" value={formData.dateOfBirth} onChange={(event) => updateField('dateOfBirth', event.target.value)} className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Gender</label>
              <Input value={formData.gender} onChange={(event) => updateField('gender', event.target.value)} placeholder="Male / Female / Other" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Country</label>
              <Input value={formData.country} onChange={(event) => updateField('country', event.target.value)} placeholder="Enter country" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">State</label>
              <Input value={formData.state} onChange={(event) => updateField('state', event.target.value)} placeholder="Enter state" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">City</label>
              <Input value={formData.city} onChange={(event) => updateField('city', event.target.value)} placeholder="Enter city" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Postal code</label>
              <Input value={formData.postalCode} onChange={(event) => updateField('postalCode', event.target.value)} placeholder="Enter postal code" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Full address</label>
              <Textarea value={formData.address} onChange={(event) => updateField('address', event.target.value)} placeholder="Enter street address, landmark" className="min-h-24 rounded-2xl" />
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Qualification</label>
              <Input value={formData.qualification} onChange={(event) => updateField('qualification', event.target.value)} placeholder="Highest qualification (e.g. B.Tech, MCA)" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">College</label>
              <Input value={formData.college} onChange={(event) => updateField('college', event.target.value)} placeholder="College / Institute name" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">University</label>
              <Input value={formData.university} onChange={(event) => updateField('university', event.target.value)} placeholder="University name" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Percentage / CGPA</label>
              <Input value={formData.percentage} onChange={(event) => updateField('percentage', event.target.value)} placeholder="Percentage or CGPA" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Passing year</label>
              <Input value={formData.passingYear} onChange={(event) => updateField('passingYear', event.target.value)} placeholder="Passing year" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Experience</label>
              <Input value={formData.experience} onChange={(event) => updateField('experience', event.target.value)} placeholder="Experience summary (e.g. Freshers / 2 years)" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Skills</label>
              <Input value={formData.skills} onChange={(event) => updateField('skills', event.target.value)} placeholder="Key skills (e.g. React, Node.js)" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Resume upload (PDF, DOC, DOCX - Max 5MB)</label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploadError && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-2.5 text-slate-700 shadow-sm">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div>
                    {formData.resumePath ? (
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-800">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Resume Uploaded</span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {uploadedFileName ? uploadedFileName : formData.resumePath.split('/').pop()}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-slate-900">Upload your resume</p>
                        <p className="text-xs text-slate-500">Supports PDF, DOC, DOCX up to 5 MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="rounded-2xl min-h-[44px]"
                  >
                    {uploading ? 'Uploading...' : formData.resumePath ? 'Replace file' : 'Choose file'}
                  </Button>
                  {formData.resumePath && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleRemoveResume}
                      disabled={uploading}
                      className="rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700 min-h-[44px]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Portfolio</label>
              <Input value={formData.portfolio} onChange={(event) => updateField('portfolio', event.target.value)} placeholder="https://portfolio.com" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">LinkedIn</label>
              <Input value={formData.linkedIn} onChange={(event) => updateField('linkedIn', event.target.value)} placeholder="https://linkedin.com/in/username" className="h-12 rounded-2xl min-h-[44px]" />
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <FileText className="mt-0.5 h-5 w-5 text-emerald-700" />
              <div>
                <p className="font-semibold text-emerald-900">Declaration</p>
                <p className="text-sm text-emerald-700">Please confirm that everything you have entered is accurate and current.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <Checkbox checked={formData.declarationAccepted} onCheckedChange={(checked) => updateField('declarationAccepted', Boolean(checked))} />
              <label className="text-sm leading-6 text-slate-600">
                I certify that the information provided is correct and I agree to the verification process.
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" onClick={prevStep} className="rounded-2xl min-h-[44px]" disabled={activeStep === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button type="button" onClick={nextStep} className="rounded-2xl min-h-[44px]">
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} className="rounded-2xl min-h-[44px]" disabled={!formData.declarationAccepted || uploading}>
              Submit application
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
