"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export function TimeSeries({ data, xKey='date', yKey='value', label='Series' }:{ data:any[]; xKey?:string; yKey?:string; label?:string }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={yKey} name={label} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
