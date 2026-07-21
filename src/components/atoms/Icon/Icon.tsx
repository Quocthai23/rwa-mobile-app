import type { LucideIcon } from 'lucide-react-native'
import {
  ArrowLeft,
  Ban,
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  Gift,
  Heart,
  Home,
  Info,
  LayoutGrid,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Moon,
  MoreHorizontal,
  Package,
  PartyPopper,
  Pencil,
  Play,
  Plus,
  Printer,
  Receipt,
  Search,
  Send,
  Settings,
  Share2,
  Smartphone,
  Smile,
  Star,
  Store,
  Sun,
  Tag,
  Trash2,
  Truck,
  User,
  Video,
  Wallet,
  X,
} from 'lucide-react-native'

// Map of all icons used in the app
export const iconMap = {
  'arrow-left': ArrowLeft,
  ban: Ban,
  bell: Bell,
  calendar: Calendar,
  camera: Camera,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  clock: Clock,
  'credit-card': CreditCard,
  'external-link': ExternalLink,
  'file-text': FileText,
  gift: Gift,
  heart: Heart,
  home: Home,
  info: Info,
  'layout-grid': LayoutGrid,
  'map-pin': MapPin,
  menu: Menu,
  'message-circle': MessageCircle,
  minus: Minus,
  moon: Moon,
  'more-horizontal': MoreHorizontal,
  package: Package,
  'party-popper': PartyPopper,
  pencil: Pencil,
  play: Play,
  plus: Plus,
  printer: Printer,
  receipt: Receipt,
  search: Search,
  send: Send,
  settings: Settings,
  'share-2': Share2,
  smartphone: Smartphone,
  smile: Smile,
  star: Star,
  store: Store,
  sun: Sun,
  tag: Tag,
  'trash-2': Trash2,
  truck: Truck,
  user: User,
  video: Video,
  wallet: Wallet,
  x: X,
} as const

export type IconName = keyof typeof iconMap

type IconProps = {
  readonly color?: string
  readonly fill?: string
  readonly name: IconName
  readonly size?: number
  readonly strokeWidth?: number
}

export function Icon({
  color = 'currentColor',
  fill = 'none',
  name,
  size = 24,
  strokeWidth = 2,
}: IconProps) {
  const LucideIconComponent: LucideIcon = iconMap[name]

  return (
    <LucideIconComponent
      color={color}
      fill={fill}
      size={size}
      strokeWidth={strokeWidth}
    />
  )
}

// Re-export commonly used icons for direct import

export {
  ArrowLeft,
  Ban,
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  Gift,
  Heart,
  Home,
  Info,
  LayoutGrid,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Moon,
  MoreHorizontal,
  Package,
  PartyPopper,
  Pencil,
  Play,
  Plus,
  Printer,
  Receipt,
  Search,
  Send,
  Settings,
  Share2,
  Smartphone,
  Smile,
  Star,
  Store,
  Sun,
  Tag,
  Trash2,
  Truck,
  User,
  Video,
  Wallet,
  X,
} from 'lucide-react-native'
