import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Formula } from '.';

afterEach(() => cleanup());

describe('<Formula/>', () => {
  it('should render formula parts individually', () => {
    render(<Formula>Li4Ti5O12</Formula>);
    expect(screen.getByText('Li')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Ti')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('O')).toBeInTheDocument();
    /** Multi-digit numbers should be rendered digit by digit */
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
  it('should render elements as spans', () => {
    render(<Formula>Li4Ti5O12</Formula>);
    expect(screen.getByText('Li').tagName).toBe('SPAN');
    expect(screen.getByText('Ti').tagName).toBe('SPAN');
    expect(screen.getByText('O').tagName).toBe('SPAN');
  });
  it('should render numbers as subscripts', () => {
    render(<Formula>Li4Ti5O12</Formula>);
    expect(screen.getByText('4').tagName).toBe('SUB');
    expect(screen.getByText('5').tagName).toBe('SUB');
    expect(screen.getByText('1').tagName).toBe('SUB');
    expect(screen.getByText('2').tagName).toBe('SUB');
  });
  it('should render non-elements as subscripts', () => {
    render(<Formula>LiFexMn2-xO4</Formula>);
    expect(screen.getAllByText('x')[0].tagName).toBe('SUB');
    expect(screen.getByText('2').tagName).toBe('SUB');
    expect(screen.getByText('-').tagName).toBe('SUB');
    expect(screen.getAllByText('x')[1].tagName).toBe('SUB');
    expect(screen.getByText('4').tagName).toBe('SUB');
  });
  it('should render decimals as subscripts', () => {
    render(<Formula>Y0.95VO4</Formula>);
    expect(screen.getByText('0').tagName).toBe('SUB');
    expect(screen.getByText('.').tagName).toBe('SUB');
    expect(screen.getByText('9').tagName).toBe('SUB');
    expect(screen.getByText('5').tagName).toBe('SUB');
    expect(screen.getByText('4').tagName).toBe('SUB');
  });
});
