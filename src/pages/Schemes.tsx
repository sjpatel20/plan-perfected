import { FileText, ExternalLink, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

// Mock government schemes
const schemes = [
  {
    id: '1',
    name: 'PM-KISAN',
    nameLocal: { hi: 'पीएम-किसान', te: 'పీఎం-కిసాన్' },
    fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    description: 'Direct income support of ₹6,000 per year to farmer families',
    ministry: 'Ministry of Agriculture',
    benefits: '₹6,000 per year in 3 installments',
    eligibility: 'All land-holding farmer families',
    status: 'active',
    applicationUrl: 'https://pmkisan.gov.in',
  },
  {
    id: '2',
    name: 'PMFBY',
    nameLocal: { hi: 'पीएमएफबीवाई', te: 'పీఎంఎఫ్‌బీవై' },
    fullName: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme protecting farmers against crop loss',
    ministry: 'Ministry of Agriculture',
    benefits: 'Insurance coverage for crop loss due to natural calamities',
    eligibility: 'All farmers growing notified crops',
    status: 'active',
    applicationUrl: 'https://pmfby.gov.in',
  },
  {
    id: '3',
    name: 'PM-KUSUM',
    nameLocal: { hi: 'पीएम-कुसुम', te: 'పీఎం-కుసుం' },
    fullName: 'Pradhan Mantri Kisan Urja Suraksha evam Utthan Mahabhiyan',
    description: 'Solar pumps and grid-connected solar power plants for farmers',
    ministry: 'Ministry of New & Renewable Energy',
    benefits: '60% subsidy on solar pumps, additional income from surplus power',
    eligibility: 'Farmers with irrigation needs',
    status: 'active',
    applicationUrl: 'https://pmkusum.mnre.gov.in',
  },
  {
    id: '4',
    name: 'Soil Health Card',
    nameLocal: { hi: 'मृदा स्वास्थ्य कार्ड', te: 'నేల ఆరోగ్య కార్డు' },
    fullName: 'Soil Health Card Scheme',
    description: 'Provides soil nutrient status and fertilizer recommendations',
    ministry: 'Ministry of Agriculture',
    benefits: 'Free soil testing and recommendations',
    eligibility: 'All farmers',
    status: 'active',
    applicationUrl: 'https://soilhealth.dac.gov.in',
  },
  {
    id: '5',
    name: 'KCC',
    nameLocal: { hi: 'केसीसी', te: 'కేసీసీ' },
    fullName: 'Kisan Credit Card',
    description: 'Easy credit access for farmers at subsidized interest rates',
    ministry: 'Ministry of Finance',
    benefits: 'Credit up to ₹3 lakh at 4% interest',
    eligibility: 'All farmers, sharecroppers, tenant farmers',
    status: 'active',
    applicationUrl: '#',
  },
  {
    id: '6',
    name: 'e-NAM',
    nameLocal: { hi: 'ई-नाम', te: 'ఇ-నామ్' },
    fullName: 'National Agriculture Market',
    description: 'Online trading platform for agricultural commodities',
    ministry: 'Ministry of Agriculture',
    benefits: 'Better price discovery, transparent auctions',
    eligibility: 'All farmers with produce to sell',
    status: 'active',
    applicationUrl: 'https://enam.gov.in',
  },
];

export default function Schemes() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = schemes.filter((scheme) =>
    scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            {t('schemes')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Government schemes and benefits for farmers
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{schemes.length}</div>
              <p className="text-sm text-muted-foreground">Active Schemes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-success">3</div>
              <p className="text-sm text-muted-foreground">Applied</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-warning">1</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-info">₹18K</div>
              <p className="text-sm text-muted-foreground">Benefits Received</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schemes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{scheme.name}</CardTitle>
                      <Badge variant="outline" className="text-success border-success/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {scheme.fullName}
                    </CardDescription>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl">🏛️</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{scheme.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <div>
                      <p className="text-sm font-medium">Benefits</p>
                      <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-info">ℹ</span>
                    <div>
                      <p className="text-sm font-medium">Eligibility</p>
                      <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-xs text-muted-foreground">{scheme.ministry}</p>
                  <Button size="sm" className="gap-2">
                    Apply Now
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Your Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">PM-KISAN</p>
                  <p className="text-sm text-muted-foreground">Approved • ₹2,000 received on Jan 15, 2026</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/30">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">PMFBY</p>
                  <p className="text-sm text-muted-foreground">Pending verification • Applied on Feb 1, 2026</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Track Status</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Soil Health Card</p>
                  <p className="text-sm text-muted-foreground">Card issued • Test done on Dec 10, 2025</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View Card</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
