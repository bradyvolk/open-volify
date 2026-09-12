import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { US_STATE_CODES, US_STATE_NAMES } from "@shared/schemas/us-states";

const CLEAR_VALUE = "__clear__";

interface StateSelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
}

/** A US state/territory picker showing full state names; selecting "None" clears the value back to "". */
function StateSelect({ id, value, onValueChange }: StateSelectProps) {
  return (
    <Select
      value={value || CLEAR_VALUE}
      onValueChange={(next) => onValueChange(next === CLEAR_VALUE ? "" : next)}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value={CLEAR_VALUE} className="text-muted-foreground">
          None
        </SelectItem>
        {US_STATE_CODES.map((code) => (
          <SelectItem key={code} value={code}>
            {US_STATE_NAMES[code]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { StateSelect };
