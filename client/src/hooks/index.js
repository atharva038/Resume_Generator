/**
 * Hooks Barrel Export
 *
 * Centralized exports for all custom hooks.
 * Use: import { useAuth, useLocalStorage, useDebounce } from '@/hooks'
 */

// Context hooks (re-exported from contexts)
export {useAuth} from "./useAuth";
export {useDarkMode} from "./useDarkMode";
export {useNavigationBlocker} from "./useNavigationBlocker";

// Utility hooks
export {useLocalStorage} from "./useLocalStorage";
export {useDebounce} from "./useDebounce";
export {useMediaQuery} from "./useMediaQuery";
export {useClickOutside} from "./useClickOutside";
export {useToggle} from "./useToggle";
export {useSectionCompletion, isSectionCompleteForResume} from "./useSectionCompletion";
export {useFloatingSectionNav} from "./useFloatingSectionNav";
export {useEditorPersistence} from "./useEditorPersistence";
export {useResumeSaveActions} from "./useResumeSaveActions";
