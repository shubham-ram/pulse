import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function StatusFilter({ processingFilter, setProcessingFilter }) {
  return (
    <>
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
        Status:
      </span>
      <Select value={processingFilter} onValueChange={setProcessingFilter}>
        <SelectTrigger className="w-[150px] bg-background cursor-pointer">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All statuses">All statuses</SelectItem>
          <SelectItem value="Processing">Processing</SelectItem>
          <SelectItem value="Analyzed">Analyzed</SelectItem>
          <SelectItem value="Ready">Ready</SelectItem>
          <SelectItem value="Failed">Failed</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}

export default StatusFilter;
