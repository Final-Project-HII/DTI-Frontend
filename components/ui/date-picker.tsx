// import React from "react";
// import { format } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover";

// interface MonthYearPickerProps {
//     selected: Date | undefined;
//     onChange: (date: Date | undefined) => void;
//     dateFormat?: string;
//     showMonthYearPicker?: any;
// }

// export function MonthYearPicker({
//     selected,
//     onChange,
//     dateFormat = "MMMM yyyy",
//     showMonthYearPicker = true,
// }: MonthYearPickerProps) {
//     return (
//         <Popover>
//             <PopoverTrigger asChild>
//                 <Button
//                     variant={"outline"}
//                     className={cn(
//                         "w-[240px] justify-start text-left font-normal",
//                         !selected && "text-muted-foreground"
//                     )}
//                 >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {selected ? format(selected, dateFormat) : <span>Pick a month</span>}
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                     mode="single"
//                     selected={selected}
//                     onSelect={onChange}
//                     initialFocus
//                     disabled={(date) =>
//                         date > new Date() || date < new Date("1900-01-01")
//                     }
//                     fromYear={1900}
//                     toYear={new Date().getFullYear()}
//                     captionLayout="dropdown-buttons"
//                     // showMonthYearPicker={showMonthYearPicker}
//                     ISOWeek
//                 />
//             </PopoverContent>
//         </Popover>
//     );
// }
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MonthYearPickerProps {
    selected?: Date;
    onChange: (date: Date | null) => void;
    dateFormat?: string;
}

export function MonthYearPicker({
    selected,
    onChange,
    dateFormat = "MMMM yyyy",
}: MonthYearPickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selected && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selected ? format(selected, dateFormat) : <span>Pick a month</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <DatePicker
                    selected={selected}
                    onChange={onChange}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    inline
                />
            </PopoverContent>
        </Popover>
    );
}