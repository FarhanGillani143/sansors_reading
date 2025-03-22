import { Link } from "expo-router";
import { StyleProp, TextStyle } from "react-native";
import { AppRoutes } from "../routes/Routes";

/**
 * Defines the properties for the `NavigationLink` component.
 * The `params` property is conditionally required based on the route being navigated to.
 * If the route requires parameters, `params` is mandatory; otherwise, it is optional or omitted.
 *
 * @template T - The route key from the `AppRoutes` type.
 * @property {string} title - The text to display for the link.
 * @property {T} navigateTo - The route to navigate to, specified by a key from `AppRoutes`.
 * @property {StyleProp<TextStyle>} [style] - Optional custom styles to apply to the link.
 * @property {AppRoutes[T]} [params] - Optional parameters for the route; required only if the route expects them.
 */
type LinkProps<T extends keyof AppRoutes> = {
  title: string;
  navigateTo: T;
  style?: StyleProp<TextStyle>;
} & (AppRoutes[T] extends undefined
  ? { params?: undefined } // If the route doesn't require params, omit `params`.
  : { params: AppRoutes[T] }); // If the route requires params, `params` is mandatory.

/**
 * A component that renders a navigational link using the `expo-router`'s `Link` component.
 * The link can accept route parameters if needed and apply custom styles.
 *
 * @template T - A key from the `AppRoutes` type, representing the route to navigate to.
 * 
 * @param {LinkProps<T>} props - The properties for configuring the navigation link.
 * @param {string} props.title - The label for the link.
 * @param {T} props.navigateTo - The target route, as defined in `AppRoutes`.
 * @param {StyleProp<TextStyle>} [props.style] - Additional styles for the link.
 * @param {AppRoutes[T]} [props.params] - Parameters for the route, required if the route needs them.
 * 
 * @returns {JSX.Element} A styled link component that facilitates navigation.
 */
export default function NavigationLink<T extends keyof AppRoutes>({
  navigateTo,
  params,
  style,
  title,
}: LinkProps<T>) {
  // If params are provided, construct the href with query parameters; otherwise, use the route path.
  const hrefWithParams = params
    ? `${navigateTo}?${new URLSearchParams(
        params as Record<string, string>
      ).toString()}`
    : navigateTo;

  return (
    <Link
      href={hrefWithParams}
      style={[{ color: "#000000", backgroundColor:'#ffffff', padding:6, borderRadius:5, fontSize: 19 }, style]}
    >
      {title}
    </Link>
  );
}
