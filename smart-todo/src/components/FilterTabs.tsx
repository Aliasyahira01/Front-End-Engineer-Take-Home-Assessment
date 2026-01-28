//UI-only component (No business logic)

// All possible filters shown on screen
type Filter =
  | 'ALL'
  | 'BACKLOG'
  | 'TODO'
  | 'IN_PROGRESS'
  | 'DONE'

// Props passed from App.tsx
type Props = {
  active: Filter                 // currently selected filter
  onChange: (filter: Filter) => void // callback to change filter
}

// Static list of filter buttons
const FILTERS: Filter[] = [
  'ALL',
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'DONE'
]

/**
 * Displays filter buttons (ALL, TODO, DONE, etc)
 */
export default function FilterTabs({ active, onChange }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        justifyContent: 'center',
        marginBottom: 20
      }}
    >
      {FILTERS.map(filter => (
        <button
          key={filter}
          onClick={() => onChange(filter)} // notify parent
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: active === filter
              ? '2px solid white'
              : '1px solid #555',
            background: '#111',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
