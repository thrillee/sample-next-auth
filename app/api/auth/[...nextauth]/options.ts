import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/ClientMember/[models]/User";
import bcrypt from "bcrypt";

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        console.log("Github Profile:  ", profile);

        let userRole = "GitHub User";
        if (profile?.email == "bellotobiloba01@gmail.com") {
          userRole = "admin";
        }

        return {
          ...profile,
          role: userRole,
        };
      },

      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),

    GoogleProvider({
      profile(profile) {
        console.log("Google Profile:  ", profile);

        let userRole = "Google User";

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email ",
          type: "email",
          placeholder: "your email",
        },
        password: {
          label: "Password ",
          type: "password",
          placeholder: "your password",
        },
      },
      async authorize(credentials) {
        try {
          const foundUser = await User.findOne({ email: credentials?.email })
            .lean()
            .exec();

          if (foundUser) {
            console.log("User exists ", foundUser);
            const match = await bcrypt.compare(
              credentials?.password,
              foundUser.password,
            );

            if (match) {
              console.log("Password matched");
              delete foundUser.password;
              foundUser["role"] = "Unverified Email";
              return foundUser;
            }
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  callback: {
    async jwt({ token, user }: any) {
      if (user) token.role = user.role;
      return token;
    },

    async session({ session, token }: any) {
      if (session?.user) session.user.role = token.role;
      return session;
    },
  },
};
