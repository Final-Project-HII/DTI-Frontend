import React from 'react';
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface DateMutationTypeFilterProps {
    dateRange: DateRange | undefined;
    setDateRange: (range: DateRange | undefined) => void;
    mutationType: string;
    setMutationType: (type: string) => void;
    onApplyFilter: () => void;
}

export function DateMutationTypeFilter({
    dateRange,
    setDateRange,
    mutationType,
    setMutationType,
    onApplyFilter
}: DateMutationTypeFilterProps) {
    return (
        <div className="flex space-x-4 mb-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            <Select value={mutationType} onValueChange={setMutationType}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Mutation Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="IN">IN</SelectItem>
                    <SelectItem value="OUT">OUT</SelectItem>
                </SelectContent>
            </Select>

            {/* <Button onClick={onApplyFilter}>Apply Filter</Button> */}
        </div>
    )
}
