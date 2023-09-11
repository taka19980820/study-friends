// import * as RestAccess from '../../utils/RestAccess';

// export const withAuth = (WrappedComponent) => {
//   const AuthenticatedComponent = (props) => {
//     // ここで認証や状態管理の処理を行う
//     return <WrappedComponent {...props} />;
//   };

//   export async function getServerSideProps(context) {
//     const user;
//     const response = await RestAccess.get('/user'); 
//     if(response.status === 200) {
//         user = response.data;
//     } else {
//         user = null;
//     }

//     if (!user) {
//       return {
//         redirect: {
//           destination: '/login',
//           permanent: false,
//         },
//       };
//     }
//     return { props: { user } };
//   }

//   return AuthenticatedComponent;
// };