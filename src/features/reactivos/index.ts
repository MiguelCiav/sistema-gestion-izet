// Public API for Reactivos Feature (HU02, HU03, HU04, HU05, HU07, HU08)
export { InventoryView } from './views/InventoryView'
export { ReagentCard } from './components/ReagentCard'
export { ReagentDetailModal } from './components/ReagentDetailModal'
export { ReagentFormModal } from './components/ReagentFormModal'
export { useReagents } from './hooks/useReagents'
export {
  reagentsService,
  type ReagentItem,
  type ReagentFilters,
  type CreateReagentInput,
  type CatalogoReactivo,
  type StockReactivo,
} from './services/reagentsService'
