import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export interface CircularProgressProps {
  percentage?: number; // 0 to 100
  statuses?: string[]; // Array of prayer statuses
  radius?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  textColor?: string;
}

const getStatusColor = (status: string | undefined, defaultColor: string, trackColor: string) => {
  if (!status) return trackColor;
  const s = status.toUpperCase();
  if (s === 'COMPLETED') return '#2ECC71';
  if (s === 'QADA') return '#F1C40F';
  if (s === 'MISSED') return '#E74C3C';
  return trackColor;
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  statuses,
  radius = 32,
  strokeWidth = 6,
  color = '#2ECC71',
  trackColor = 'rgba(255, 255, 255, 0.15)',
  textColor = '#FFF',
}) => {
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;

  let calcPercentage = percentage;
  if (calcPercentage === undefined && statuses && statuses.length > 0) {
    const done = statuses.filter(s => {
      const u = s?.toUpperCase();
      return u === 'COMPLETED' || u === 'QADA';
    }).length;
    calcPercentage = Math.round((done / statuses.length) * 100);
  }
  const displayPercentage = calcPercentage !== undefined ? calcPercentage : 0;

  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(displayPercentage, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [displayPercentage, animatedValue]);

  const isMultiColor = statuses && statuses.length === 5;
  const segmentGap = 3.5;
  const segmentLength = Math.max(0, (circumference / 5) - segmentGap);

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg height={radius * 2} width={radius * 2}>
        <G rotation="-90" origin={`${radius}, ${radius}`}>
          {/* Background Track Circle */}
          <Circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {isMultiColor ? (
            statuses.map((st, i) => {
              const segColor = getStatusColor(st, color, 'transparent');
              if (segColor === 'transparent') return null;

              const offset = -i * (circumference / 5);
              return (
                <Circle
                  key={`seg-${i}`}
                  cx={radius}
                  cy={radius}
                  r={innerRadius}
                  stroke={segColor}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              );
            })
          ) : (
            <Circle
              cx={radius}
              cy={radius}
              r={innerRadius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * displayPercentage) / 100}
              strokeLinecap="round"
            />
          )}
        </G>
        <SvgText
          x={radius}
          y={radius + 5}
          textAnchor="middle"
          fill={textColor}
          fontSize="15"
          fontWeight="bold"
        >
          {`${displayPercentage}%`}
        </SvgText>
      </Svg>
    </View>
  );
};
