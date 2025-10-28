import React, { useMemo, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useMembers } from "../providers/MembersProvider";
import { useLogin } from "../providers/LoginProvider";
import { MemberProps } from "../utils/types";

// Pricing logic mirrors the UI copy in HomePage and MemberAddDialog
const getMemberPrice = (member: MemberProps): number => {
  const duration = member.membership_duration; // 90 | 180 | 365
  const isNew = !!member.is_new_member;
  if (isNew) {
    if (duration === 365) return 60;
    if (duration === 180) return 50;
    if (duration === 90) return 30;
  } else {
    if (duration === 365) return 40;
    if (duration === 180) return 30;
    if (duration === 90) return 20;
  }
  return 0;
};

// Helpers to compute date ranges
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const startOfWeek = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  // Make week start on Monday; adjust if Sunday desired
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday as start
  d.setDate(d.getDate() + diff);
  return d.getTime();
};

const startOfMonth = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const fmtCurrency = (n: number) => `$${n.toFixed(2)}`;

export default function IncomePage() {
  const { isAdmin } = useLogin();
  const { membersData } = useMembers();
  const [range, setRange] = useState<"day" | "week" | "month">("day");

  const [fromTs, label] = useMemo((): [number, string] => {
    switch (range) {
      case "day":
        return [startOfToday(), "Today"];
      case "week":
        return [startOfWeek(), "This Week"];
      case "month":
        return [startOfMonth(), "This Month"];
    }
  }, [range]);

  const filtered = useMemo(() => {
    return membersData.filter((m) => (m.join_datetime ?? 0) >= fromTs);
  }, [membersData, fromTs]);

  const totals = useMemo(() => {
    let newCount = 0;
    let renewCount = 0;
    let newSum = 0;
    let renewSum = 0;
    for (const m of filtered) {
      const price = getMemberPrice(m);
      if (m.is_new_member) {
        newCount += 1;
        newSum += price;
      } else {
        renewCount += 1;
        renewSum += price;
      }
    }
    return {
      total: newSum + renewSum,
      new: { count: newCount, sum: newSum },
      renew: { count: renewCount, sum: renewSum },
    };
  }, [filtered]);

  // Non-admins (staff) see an audit-only notice
  if (!isAdmin) {
    return (
      <div className="max-w-5xl mx-auto w-full p-4">
        <Typography variant="h4" className="text-gray-900 font-bold mb-2">
          Income
        </Typography>
        <Typography variant="h6" className="text-gray-800 font-semibold">
          For Board Member Audit Only
        </Typography>
        <Typography variant="body2" className="text-gray-600 mt-2">
          Please contact a board member if you need access to these details.
        </Typography>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full p-4">
      <Typography variant="h4" className="text-gray-900 font-bold mb-2">
        Income
      </Typography>
      <Typography variant="body1" className="text-gray-700 mb-4">
        Estimated membership income collected in the selected period.
        Reference only for audit purposes.
        Contact Xinghan Yang or another webDevStaff for improvements on logistics.
      </Typography>

      <ToggleButtonGroup
        exclusive
        value={range}
        onChange={(_, v) => v && setRange(v)}
        size="small"
        color="primary"
        className="mb-4"
      >
        <ToggleButton value="day">Today</ToggleButton>
        <ToggleButton value="week">This Week</ToggleButton>
        <ToggleButton value="month">This Month</ToggleButton>
      </ToggleButtonGroup>

      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6" className="font-bold">
            {label}
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="bg-green-50 rounded-lg p-3">
              <Typography variant="subtitle1" className="font-semibold">
                New Members
              </Typography>
              <Typography variant="body2">Count: {totals.new.count}</Typography>
              <Typography variant="body1" className="font-bold">
                {fmtCurrency(totals.new.sum)}
              </Typography>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <Typography variant="subtitle1" className="font-semibold">
                Renewals
              </Typography>
              <Typography variant="body2">Count: {totals.renew.count}</Typography>
              <Typography variant="body1" className="font-bold">
                {fmtCurrency(totals.renew.sum)}
              </Typography>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <Typography variant="subtitle1" className="font-semibold">
                Total
              </Typography>
              <Typography variant="body2">Count: {totals.new.count + totals.renew.count}</Typography>
              <Typography variant="h6" className="font-bold">
                {fmtCurrency(totals.total)}
              </Typography>
            </div>
          </div>
          <Typography variant="caption" className="block mt-2 text-gray-600">
            Uses member.join_datetime to determine period; prices are based on membership duration
            and whether the record was added as new or renewal.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
