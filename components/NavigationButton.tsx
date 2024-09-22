import { Link } from "expo-router";
import { StyleProp, TextStyle } from "react-native";

interface PropType {
  title: string; // The text to display on the button
  navigateTo: string; // The route name or URL to navigate to
  style?: StyleProp<TextStyle>;
}

/**
 * NavigationButton Component
 *
 * This component renders a text-based button that navigates to a specified route
 * when clicked. It utilizes the `Link` component from `expo-router` to handle
 * the navigation.
 *
 * @param {string} title - The text to display on the button.
 * @param {string} navigateTo - The name of the route or URL to navigate to.
 * @returns A styled link that acts as a navigation button.
 */
export default function NavigationButton({
  title,
  navigateTo,
  style,
}: PropType) {
  return (
    <Link href={navigateTo} style={[{ color: "#007AFF", fontSize: 18 }, style]}>
      {title}
    </Link>
  );
}
