"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Searchbar from "../components/Searchbar";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [subscriptionPlan, setSubscriptionPlan] = useState("Basic");
  const [userEmail, setUserEmail] = useState<string | null>(
    auth.currentUser?.email ?? null,
  );
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(auth.currentUser));
  const [isAuthResolved, setIsAuthResolved] = useState(
    Boolean(auth.currentUser),
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
  };

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  useEffect(() => {
    const syncUserSettings = async (user: User | null) => {
      setUserEmail(user?.email ?? null);
      setIsLoggedIn(Boolean(user));
      setIsAuthResolved(true);
      setIsLoading(false);

      if (!user) {
        setSubscriptionPlan("Basic");
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const planValue = userData.subscriptionPlan ?? userData.plan;

          setSubscriptionPlan(
            typeof planValue === "string" && planValue.trim().length > 0
              ? planValue
              : "Basic",
          );
        } else {
          setSubscriptionPlan("Basic");
        }
      } catch (error) {
        console.error("Error loading subscription plan:", error);
        setSubscriptionPlan("Basic");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      void syncUserSettings(user);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="settings__skeleton--page">
        <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLoginClick={handleLoginClick}
        />
        <div className="settings__main-content">
          <Searchbar toggleSidebar={toggleSidebar} />
          <div className="settings__wrapper-skeleton-loading">
            <div className="settings__container-skeleton-loading">
              <div className="settings__row-skeleton-loading">
                <h1 className="settings__title">Settings</h1>
                <div className="settings__content">
                  <div className="settings__item-label-skeleton-loading"></div>
                  <div className="settings__item-value-skeleton-loading"></div>
                  <div className="upgrade__btn-skeleton-loading"></div>
                </div>
                <div className="settings__content">
                  <div className="settings__item-value-skeleton-loading"></div>
                  <div className="settings__item-label-skeleton-loading"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="settings">
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseModal}
        onSwitchToSignup={handleSwitchToSignup}
        redirectTo={null}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={handleCloseModal}
        onSwitchToLogin={handleSwitchToLogin}
        redirectTo={null}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLoginClick={handleLoginClick}
      />
      <div className="settings__main-content">
        <Searchbar toggleSidebar={toggleSidebar} />
        {!isAuthResolved ? (
          <div className="settings__wrapper">
            <div className="settings__container">
              <div className="settings__row">
                <h1 className="settings__title">Settings</h1>
                <div className="settings__content">
                  {/* <div className="settings__item-label">Loading account details...</div> */}
                </div>
              </div>
            </div>
          </div>
        ) : isLoggedIn ? (
          <div className="settings__wrapper">
            <div className="settings__container">
              <div className="settings__row">
                <h1 className="settings__title">Settings</h1>
                <div className="settings__content">
                  <div className="settings__item-label">
                    Your Subscription Plan
                  </div>
                  <div className="settings__item-value">{subscriptionPlan}</div>
                  <a href="./plan" className="upgrade__btn">Upgrade to Premium</a>
                </div>
                <div className="settings__content">
                  <div className="settings__item-label">Email</div>
                  <div className="settings__item-value">
                    {userEmail ?? "Not signed in"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="login__wrapper">
            <div className="login__container">
              <div className="login__row">
                <h1 className="login__title">Settings</h1>
                <div className="settings__login--wrapper">
                  <figure className="login__image">
                    <img className="login__img" src="./assets/login.png" alt="" />
                  </figure>
                  <div className="settings__login--text">
                    Log in to your account to see your details.
                  </div>
                  <button
                    type="button"
                    className="btn settings__login--btn"
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
