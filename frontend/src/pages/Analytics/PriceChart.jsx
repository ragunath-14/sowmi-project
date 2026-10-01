import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const COLOR = '#2a78d6';

const formatDate = (d) => {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: '#fcfcfb',
        border: '1px solid rgba(11,11,11,0.10)',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 13,
        color: '#0b0b0b',
      }}
    >
      <div style={{ color: '#52514e', marginBottom: 4 }}>{formatDate(label)}</div>
      <div style={{ fontWeight: 600 }}>₹{payload[0].value.toLocaleString()}</div>
    </div>
  );
};

const PriceChart = ({ data, symbol }) => {
  if (!data || data.length === 0) return null;

  // Thin the x-axis ticks so a year of daily data doesn't collide.
  const tickInterval = Math.max(Math.floor(data.length / 6), 1);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header fw-bold">Price Chart — {symbol} (1Y)</div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLOR} stopOpacity={0.1} />
                <stop offset="100%" stopColor={COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e1e0d9" strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={tickInterval}
              tick={{ fill: '#898781', fontSize: 12 }}
              axisLine={{ stroke: '#c3c2b7' }}
              tickLine={false}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: '#898781', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="close"
              stroke={COLOR}
              strokeWidth={2}
              fill="url(#priceFill)"
              dot={false}
              activeDot={{ r: 4, fill: COLOR, stroke: '#fcfcfb', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
