import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MediaItem } from './MediaItem'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import type { MediaType } from '../../features/folder-slice'

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
}))

vi.mock('../../services/drag-media-service/use-drag-media', () => ({
  useDragMedia: () => ({
    isDragging: false,
    drag: (el: HTMLElement) => el,
  }),
}))

vi.mock('../../services/media-service/media-service', () => ({
  handleDeleteMedia: vi.fn(),
  handleRenameMedia: vi.fn(),
}))

const mockItem = {
  id: '1',
  name: 'test-image',
  type: 'image' as MediaType,
  url: 'test.jpg',
  width: 800,
  height: 600,
}

describe('MediaItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = (props = {}) => {
    return render(
      <DndProvider backend={HTML5Backend}>
        <MediaItem
          item={mockItem}
          isSelected={false}
          selectedMediaIds={[]}
          onToggle={vi.fn()}
          {...props}
        />
      </DndProvider>
    )
  }

  it('should render media item correctly', () => {
    renderComponent()
    
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByText('test-image')).toBeInTheDocument()
  })

  it('should show selection index when selected', () => {
    renderComponent({ isSelected: true, selectedMediaIds: ['1'] })
    
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should handle delete button click', async () => {
    const { handleDeleteMedia } = await import('../../services/media-service/media-service')
    renderComponent()
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleDeleteMedia).toHaveBeenCalledWith('1', expect.any(Function))
  })

  it('should toggle rename input when clicking name', () => {
    renderComponent()
    
    fireEvent.click(screen.getByText('test-image'))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should handle rename submission', async () => {
    const { handleRenameMedia } = await import('../../services/media-service/media-service')
    renderComponent()
    
    fireEvent.click(screen.getByText('test-image'))
    const input = screen.getByRole('textbox')
    
    fireEvent.change(input, { target: { value: 'new-name' } })
    fireEvent.blur(input)
    
    expect(handleRenameMedia).toHaveBeenCalledWith(
      '1',
      'new-name',
      expect.any(Function)
    )
  })

  it('should show loading state before media loads', () => {
    renderComponent()
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should show media when loaded', async () => {
    renderComponent()
    
    const img = screen.getByRole('img')
    fireEvent.load(img)
    
    expect(img).toHaveClass('opacity-100')
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
})
