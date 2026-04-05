import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function SensitivityFilter({ sensitivityFilter, setSensitivityFilter }) {
  return (
    <>
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
        Sensitivity:
      </span>
      <Select value={sensitivityFilter} onValueChange={setSensitivityFilter}>
        <SelectTrigger className="w-[150px] bg-background cursor-pointer">
          <SelectValue placeholder="Sensitivity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All sensitivity">All sensitivity</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Safe">Safe</SelectItem>
          <SelectItem value="Flagged">Flagged</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}

export default SensitivityFilter;
