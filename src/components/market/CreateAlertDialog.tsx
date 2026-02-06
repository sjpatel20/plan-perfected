import { useState } from 'react';
import { Bell, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePriceAlerts, CreateAlertInput } from '@/hooks/usePriceAlerts';

const COMMODITIES = [
  'Wheat',
  'Rice (Basmati)',
  'Soybean',
  'Cotton',
  'Gram (Chana)',
  'Mustard',
  'Maize',
  'Groundnut',
  'Onion',
  'Potato',
  'Tomato',
];

const STATES = [
  'Madhya Pradesh',
  'Haryana',
  'Maharashtra',
  'Rajasthan',
  'Karnataka',
  'Gujarat',
  'Uttar Pradesh',
  'Punjab',
];

interface CreateAlertDialogProps {
  defaultCommodity?: string;
  defaultMandi?: string;
  defaultState?: string;
}

export function CreateAlertDialog({
  defaultCommodity,
  defaultMandi,
  defaultState,
}: CreateAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [commodity, setCommodity] = useState(defaultCommodity || '');
  const [mandiName, setMandiName] = useState(defaultMandi || '');
  const [mandiState, setMandiState] = useState(defaultState || '');
  const [threshold, setThreshold] = useState('5');
  const [alertType, setAlertType] = useState<'increase' | 'decrease' | 'both'>('both');

  const { createAlert } = usePriceAlerts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commodity) return;

    const input: CreateAlertInput = {
      commodity,
      mandi_name: mandiName || undefined,
      mandi_state: mandiState || undefined,
      threshold_percentage: parseFloat(threshold) || 5,
      alert_type: alertType,
    };

    await createAlert.mutateAsync(input);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCommodity(defaultCommodity || '');
    setMandiName(defaultMandi || '');
    setMandiState(defaultState || '');
    setThreshold('5');
    setAlertType('both');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Bell className="h-4 w-4" />
          Create Price Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Create Price Alert
          </DialogTitle>
          <DialogDescription>
            Get notified when commodity prices change significantly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="commodity">Commodity *</Label>
            <Select value={commodity} onValueChange={setCommodity}>
              <SelectTrigger>
                <SelectValue placeholder="Select commodity" />
              </SelectTrigger>
              <SelectContent>
                {COMMODITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mandi">Mandi (Optional)</Label>
              <Input
                id="mandi"
                value={mandiName}
                onChange={(e) => setMandiName(e.target.value)}
                placeholder="e.g., Indore"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State (Optional)</Label>
              <Select value={mandiState} onValueChange={setMandiState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold (%)</Label>
              <Input
                id="threshold"
                type="number"
                min="1"
                max="50"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alertType">Alert When</Label>
              <Select value={alertType} onValueChange={(v) => setAlertType(v as typeof alertType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Price Changes</SelectItem>
                  <SelectItem value="increase">Price Increases</SelectItem>
                  <SelectItem value="decrease">Price Decreases</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!commodity || createAlert.isPending}>
              {createAlert.isPending ? 'Creating...' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
