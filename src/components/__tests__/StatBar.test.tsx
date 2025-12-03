// StatBar component tests
import React from 'react';
import { render } from '@testing-library/react-native';
import { StatBar } from '../StatBar';

describe('StatBar', () => {
  test('renders with correct value and percentage', () => {
    const { getByText } = render(
      <StatBar label="HP" value={75} max={100} color="#FF4444" />
    );
    
    expect(getByText('HP')).toBeTruthy();
    expect(getByText('75/100')).toBeTruthy();
  });

  test('updates when value changes', () => {
    const { rerender, getByText } = render(
      <StatBar label="HP" value={50} max={100} color="#FF4444" />
    );
    
    expect(getByText('50/100')).toBeTruthy();
    
    rerender(<StatBar label="HP" value={25} max={100} color="#FF4444" />);
    
    expect(getByText('25/100')).toBeTruthy();
  });

  test('handles zero value', () => {
    const { getByText } = render(
      <StatBar label="HP" value={0} max={100} color="#FF4444" />
    );
    
    expect(getByText('0/100')).toBeTruthy();
  });

  test('handles max value', () => {
    const { getByText } = render(
      <StatBar label="HP" value={100} max={100} color="#FF4444" />
    );
    
    expect(getByText('100/100')).toBeTruthy();
  });
});

