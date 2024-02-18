import { isAuthenticated } from "@/actions/auth";
import "server-only";

// const withAuth = <T,>(Component: React.ComponentType<T & SessionProps>) => {
//   const WrappedComponent = async (props: T) => {
//     // Your server-side logic here
//     isAuthenticated();

//     return <Component {...props} session={session} />;
//   };
//   WrappedComponent.displayName = `withAuth(${Component.displayName})`;
//   return WrappedComponent;
// };

// export default withAuth;

// export interface SessionProps {
//   session: Session | null;
// }
