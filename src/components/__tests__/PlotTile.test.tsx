// PlotTile component tests
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PlotTile } from '../PlotTile';
import type { Plant } from '../../types';
import { GROWTH_STAGES } from '../../constants/gameConstants';

describe('PlotTile', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  test('renders empty state correctly', () => {
    const { getByText } = render(
      <PlotTile plant={null} onPress={mockOnPress} />
    );
    
    expect(getByText('+')).toBeTruthy();
    expect(getByText('Plant')).toBeTruthy();
  });

  test('handles tap for empty plot', () => {
    const { getByText } = render(
      <PlotTile plant={null} onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('+'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('renders planted state with growth stage', () => {
    const plant: Plant = {
      seedId: 'test-seed',
      plantedAtTick: 0,
      wateredToday: true,
      growthStage: GROWTH_STAGES.STAGE_2,
      isPassive: false,
    };
    
    const { getByText } = render(
      <PlotTile plant={plant} onPress={mockOnPress} />
    );
    
    expect(getByText('Growing')).toBeTruthy();
  });

  test('shows water indicator when needs water', () => {
    const plant: Plant = {
      seedId: 'test-seed',
      plantedAtTick: 0,
      wateredToday: false,
      growthStage: GROWTH_STAGES.STAGE_1,
      isPassive: false,
    };
    
    const { getByText } = render(
      <PlotTile plant={plant} onPress={mockOnPress} />
    );
    
    // Water emoji should be present
    expect(getByText('💧')).toBeTruthy();
  });

  test('shows harvest indicator when harvestable', () => {
    const plant: Plant = {
      seedId: 'test-seed',
      plantedAtTick: 0,
      wateredToday: true,
      growthStage: GROWTH_STAGES.HARVESTABLE,
      isPassive: false,
    };
    
    const { getByText } = render(
      <PlotTile plant={plant} onPress={mockOnPress} />
    );
    
    expect(getByText('Ready!')).toBeTruthy();
    expect(getByText('✨')).toBeTruthy();
  });
});

