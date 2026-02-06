import { useState } from 'react';
import { Edit, Plus, Trash2, Loader2, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { usePlots, PlotWithCrop } from '@/hooks/usePlots';
import { toast } from 'sonner';

const SOIL_TYPES = [
  'Alluvial',
  'Black Cotton',
  'Red',
  'Laterite',
  'Mountain',
  'Desert',
  'Saline',
  'Peaty',
  'Forest',
  'Other',
];

const IRRIGATION_TYPES = [
  { value: 'borewell', label: 'Borewell' },
  { value: 'canal', label: 'Canal' },
  { value: 'drip', label: 'Drip' },
  { value: 'sprinkler', label: 'Sprinkler' },
  { value: 'rainfed', label: 'Rainfed' },
  { value: 'other', label: 'Other' },
];

const OWNERSHIP_TYPES = [
  { value: 'owned', label: 'Owned' },
  { value: 'leased', label: 'Leased' },
  { value: 'shared', label: 'Shared' },
];

// Helper to format display of irrigation/ownership types
const formatType = (value: string | null | undefined, types: { value: string; label: string }[]): string => {
  if (!value) return '—';
  const found = types.find(t => t.value === value);
  return found ? found.label : value;
};

interface PlotFormData {
  plot_name: string;
  area_hectares: string;
  soil_type: string;
  irrigation_type: string;
  ownership_type: string;
}

const emptyFormData: PlotFormData = {
  plot_name: '',
  area_hectares: '',
  soil_type: '',
  irrigation_type: '',
  ownership_type: '',
};

export function PlotsList() {
  const { plots, isLoading, createPlot, updatePlot, deletePlot } = usePlots();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingPlot, setEditingPlot] = useState<PlotWithCrop | null>(null);
  const [formData, setFormData] = useState<PlotFormData>(emptyFormData);

  const handleOpenAdd = () => {
    setEditingPlot(null);
    setFormData(emptyFormData);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (plot: PlotWithCrop) => {
    setEditingPlot(plot);
    setFormData({
      plot_name: plot.plot_name,
      area_hectares: plot.area_hectares?.toString() || '',
      soil_type: plot.soil_type || '',
      irrigation_type: plot.irrigation_type || '',
      ownership_type: plot.ownership_type || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.plot_name.trim()) {
      toast.error('Plot name is required');
      return;
    }

    try {
      const plotData = {
        plot_name: formData.plot_name.trim(),
        area_hectares: formData.area_hectares ? parseFloat(formData.area_hectares) : undefined,
        soil_type: formData.soil_type || undefined,
        irrigation_type: formData.irrigation_type || undefined,
        ownership_type: formData.ownership_type || undefined,
      };

      if (editingPlot) {
        await updatePlot.mutateAsync({ id: editingPlot.id, ...plotData });
        toast.success('Plot updated successfully');
      } else {
        await createPlot.mutateAsync(plotData);
        toast.success('Plot added successfully');
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save plot');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    
    try {
      await deletePlot.mutateAsync(deleteConfirmId);
      toast.success('Plot deleted successfully');
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete plot');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-success" />
                My Plots
              </CardTitle>
              <CardDescription>Manage your farm plots and crop details</CardDescription>
            </div>
            <Button size="sm" onClick={handleOpenAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Plot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {plots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Leaf className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No plots added yet</p>
              <p className="text-sm">Add your first plot to start tracking your farm</p>
              <Button className="mt-4" onClick={handleOpenAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Plot
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plots.map((plot) => (
                <div
                  key={plot.id}
                  className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{plot.plot_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {plot.area_hectares ? `${plot.area_hectares} hectares` : 'Area not specified'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleOpenEdit(plot)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirmId(plot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Soil Type</p>
                      <p className="font-medium">{plot.soil_type || '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Irrigation</p>
                      <p className="font-medium">{formatType(plot.irrigation_type, IRRIGATION_TYPES)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Current Crop</p>
                      {plot.currentCrop ? (
                        <Badge variant="outline" className="mt-1">
                          🌾 {plot.currentCrop}
                        </Badge>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No active crop</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlot ? 'Edit Plot' : 'Add New Plot'}</DialogTitle>
            <DialogDescription>
              {editingPlot ? 'Update your plot details' : 'Add a new plot to track your farm land'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plot_name">Plot Name *</Label>
              <Input
                id="plot_name"
                value={formData.plot_name}
                onChange={(e) => setFormData(prev => ({ ...prev, plot_name: e.target.value }))}
                placeholder="e.g., Main Field, East Plot"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Area (hectares)</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
                min="0"
                value={formData.area_hectares}
                onChange={(e) => setFormData(prev => ({ ...prev, area_hectares: e.target.value }))}
                placeholder="e.g., 2.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Soil Type</Label>
                <Select 
                  value={formData.soil_type} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, soil_type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOIL_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Irrigation Type</Label>
                <Select 
                  value={formData.irrigation_type} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, irrigation_type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select irrigation" />
                  </SelectTrigger>
                  <SelectContent>
                    {IRRIGATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ownership Type</Label>
              <Select 
                value={formData.ownership_type} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, ownership_type: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ownership" />
                </SelectTrigger>
                <SelectContent>
                  {OWNERSHIP_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createPlot.isPending || updatePlot.isPending}
            >
              {(createPlot.isPending || updatePlot.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingPlot ? 'Save Changes' : 'Add Plot'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plot?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this plot and cannot be undone. 
              Any crop cycles associated with this plot will also be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePlot.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
