"use client"

import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { RiBallPenLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { usePathname } from "next/navigation";
// import { RxHamburgerMenu } from "react-icons/rx";
import { RiFontSize } from "react-icons/ri";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
  showFontSizeControls?: boolean;
  fontSize?: string;
  onFontSizeChange?: (size: string) => void;
}

const Sidebar = ({ isOpen, onClose, onLoginClick, showFontSizeControls = false, fontSize = '16px', onFontSizeChange }: SidebarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(Boolean(user));
    });

    return () => unsubscribe();
  }, []);

  const fontSizes = [
    { label: '14px', size: '16px', iconSize: '16px' },
    { label: '16px', size: '18px', iconSize: '18px' },
    { label: '20px', size: '22px', iconSize: '22px' },
    { label: '24px', size: '26px', iconSize: '26px' }
  ];

  return (
    <>
      <div 
        className={`sidebar__overlay ${isOpen ? '' : 'sidebar__overlay--hidden'}`}
        onClick={onClose}
      ></div>
      <div className={`sidebar__closed ${isOpen ? 'sidebar__open' : ''}`}>
        <div className="sidebar__logo">
          <img className="nav__img" src="/assets/logo.png" alt="logo" />
        </div>
        <div className="sidebar__wrapper">
          <div className="sidebar__top">
            <a href="/forYou" className="sidebar__link--wrapper">
              <div
                className={
                  pathname === "/forYou"
                    ? "sidebar__link--line-active--tab"
                    : "sidebar__link--line"
                }
              ></div>
              <div className="sidebar__icon--wrapper">
                <AiOutlineHome />
              </div>
              <div className="sidebar__link--text">For You</div>
            </a>
            <div className="sidebar__link--wrapper sidebar__link--not-allowed">
              <div
                className={
                  pathname === "/library"
                    ? "sidebar__link--line-active--tab"
                    : "sidebar__link--line"
                }
              ></div>
              <div className="sidebar__icon--wrapper">
                <CiBookmark />
              </div>
              <div className="sidebar__link--text">My Library</div>
            </div>
            <div className="sidebar__link--wrapper sidebar__link--not-allowed">
              <div className="sidebar__link--line"></div>
              <div className="sidebar__icon--wrapper">
                <RiBallPenLine />
              </div>
              <div className="sidebar__link--text">Highlights</div>
            </div>
            <div className="sidebar__link--wrapper sidebar__link--not-allowed">
              <div className="sidebar__link--line"></div>
              <div className="sidebar__icon--wrapper">
                <IoMdSearch />
              </div>
              <div className="sidebar__link--text">Search</div>
            </div>
            {showFontSizeControls && (
              <div className="sidebar__link--wrapper">
                {/* <div className="sidebar__link--line"></div> */}
                <div style={{ width: '20px' }}></div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '32px' }}>
                  {fontSizes.map((item) => (
                    <button 
                      key={item.size}
                      onClick={() => onFontSizeChange?.(item.size)}
                      style={{ 
                        position: 'relative',
                        paddingBottom: '6px',
                        marginLeft: '6px',
                        fontSize: item.iconSize,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'flex-end',
                        height: '100%'
                      }}
                    >
                      <RiFontSize />
                      <span 
                        style={{
                          position: 'absolute',
                          bottom: '2px',
                          left: 0,
                          height: '2px',
                          backgroundColor: '#2bd97c',
                          transition: 'width 0.3s',
                          width: fontSize === item.size ? '100%' : '0'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="sidebar__bottom">
            <a href="/settings" className="sidebar__link--wrapper">
              <div
                className={
                  pathname === "/settings"
                    ? "sidebar__link--line-active--tab"
                    : "sidebar__link--line"
                }
              ></div>
              <div className="sidebar__icon--wrapper">
                <FiSettings />
              </div>
              <div className="sidebar__link--text">Settings</div>
            </a>
            <div className="sidebar__link--wrapper sidebar__link--not-allowed">
              <div className="sidebar__link--line"></div>
              <div className="sidebar__icon--wrapper">
                <IoIosHelpCircleOutline />
              </div>
              <div className="sidebar__link--text">Help & Support</div>
            </div>
            {isLoggedIn ? (
              <button
                type="button"
                className="sidebar__link--wrapper"
                onClick={async () => {
                  try {
                    await signOut(auth);
                    onClose();
                  } catch (error) {
                    console.error("Error signing out:", error);
                  }
                }}
              >
                <div className="sidebar__link--line"></div>
                <div className="sidebar__icon--wrapper">
                  <FiLogOut />
                </div>
                <div className="sidebar__link--text">Logout</div>
              </button>
            ) : onLoginClick ? (
              <button
                type="button"
                className="sidebar__link--wrapper"
                onClick={onLoginClick}
              >
                <div className="sidebar__link--line"></div>
                <div className="sidebar__icon--wrapper">
                  <IoMdSearch />
                </div>
                <div className="sidebar__link--text">Login</div>
              </button>
            ) : (
              <a href="/login" className="sidebar__link--wrapper">
                <div className="sidebar__link--line"></div>
                <div className="sidebar__icon--wrapper">
                  <IoMdSearch />
                </div>
                <div className="sidebar__link--text">Login</div>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
