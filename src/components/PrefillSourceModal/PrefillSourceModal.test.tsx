
import { render, screen, fireEvent, } from '@testing-library/react';
import { PrefillSourceModal } from './PrefillSourceModal';
import { SourceData } from '@/types/types'
import { vi, describe, expect, test, beforeEach,   } from 'vitest';
import '@testing-library/jest-dom';

const mockSources: SourceData[] = [
  {
    label: "Form: Form A",
    fields: [
      { field: "name", formName: "Form A", formId: "form-a-id" },
      { field: "email", formName: "Form A", formId: "form-a-id" }
    ]
  },
  {
    label: "Form: Form B",
    fields: [
      { field: "address", formName: "Form B", formId: "form-b-id" },
      { field: "phone", formName: "Form B", formId: "form-b-id" }
    ]
  },
  {
    label: "Action Properties",
    fields: [
      { field: "action_id", formName: "Global", formId: "global" },
      { field: "action_status", formName: "Global", formId: "global" }
    ]
  }
];


const mockOnClose = vi.fn();
const mockOnSelect = vi.fn();

describe('PrefillSourceModal', () => {
 
  beforeEach(() => {
    mockOnClose.mockReset();
    mockOnSelect.mockReset();
  });

  test('renders nothing when open is false', () => {
    render(
      <PrefillSourceModal
        open={false}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        sources={mockSources}
        fieldName="Test Field"
      />
    );
    
    expect(screen.queryByText('Select data source for "Test Field"')).not.toBeInTheDocument();
  });

  test('renders the modal when open is true', () => {
    render(
      <PrefillSourceModal
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        sources={mockSources}
        fieldName="Test Field"
      />
    );
    
    expect(screen.getByText('Select data source for "Test Field"')).toBeInTheDocument();
    expect(screen.getByText('Form: Form A')).toBeInTheDocument();
    expect(screen.getByText('Form: Form B')).toBeInTheDocument();
    expect(screen.getByText('Action Properties')).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(
      <PrefillSourceModal
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        sources={mockSources}
        fieldName="Test Field"
      />
    );
    
    fireEvent.click(screen.getByText('CANCEL'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('expands a category when clicked', () => {
    render(
      <PrefillSourceModal
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        sources={mockSources}
        fieldName="Test Field"
      />
    );
    
    expect(screen.queryByText('name')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Form: Form A'));
    
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
  });

  test('filters sources when searching', () => {
    render(
      <PrefillSourceModal
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        sources={mockSources}
        fieldName="Test Field"
      />
    );
    
    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'email' }
    });
    

    expect(screen.getByText('Form: Form A')).toBeInTheDocument();
    expect(screen.queryByText('Form: Form B')).not.toBeInTheDocument();
    expect(screen.queryByText('Action Properties')).not.toBeInTheDocument();
    
    expect(screen.getByText('email')).toBeInTheDocument();
  });

  test('calls onSelect when a field is clicked', () => {
    render(
      <PrefillSourceModal
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        sources={mockSources}
        fieldName="Test Field"
      />
    );
    
 
    fireEvent.click(screen.getByText('Form: Form A'));
    
    fireEvent.click(screen.getByText('name'));
    
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith({
      sourceType: "form",
      sourceFormId: "form-a-id",
      sourceField: "name"
    });
  });

  test('shows no results message when search has no matches', () => {
    render(
      <PrefillSourceModal
        open={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        sources={mockSources}
        fieldName="Test Field"
      />
    );
    
    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: 'nonexistent' }
    });
    
    expect(screen.getByText('No matches found for "nonexistent"')).toBeInTheDocument();
  });
});