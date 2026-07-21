/**
 * Clipboard utility using @react-native-clipboard/clipboard.
 */
import Clipboard from '@react-native-clipboard/clipboard'

export async function setString(text: string): Promise<void> {
  Clipboard.setString(text)
}

export async function getString(): Promise<string> {
  return Clipboard.getString()
}
