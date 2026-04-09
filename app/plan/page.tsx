'use client'

import React, { useState, useEffect } from "react";
import { AiFillFileText } from "react-icons/ai";
import { RiPlantFill } from "react-icons/ri";
import { FaHandshake } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";


  const Plan = () => {
    const [selectedPlan, setSelectedPlan] = useState("premium");

    useEffect(() => {
      const cards = Array.from(document.querySelectorAll(".accordion__card"));
      const cleanup: Array<() => void> = [];

      cards.forEach((card) => {
        const header = card.querySelector(".accordion__header");
        if (!header) {
          return;
        }

        const handler = () => {
          cards.forEach((other) => {
            if (other !== card) {
              other.classList.remove("accordion__card--open");
            }
          });
          card.classList.toggle("accordion__card--open");
        };

        header.addEventListener("click", handler);
        cleanup.push(() => header.removeEventListener("click", handler));
      });

      return () => cleanup.forEach((fn) => fn());
    }, []);


    return (
      <div id="plan">
        <div className="plan__header--wrapper">
          <div className="plan__header">
            <div className="plan__title">Get unlimited access to many amazing books to read</div>
            <div className="plan__sub--title">Turn ordinary  moments into amazing learning opportunities
            </div>
            <figure className="plan__img--mask">
              <img src="/assets/pricing-top.png" alt="pricing" />
            </figure>
          </div>
        </div>
        <div className="plan__row">
          <div className="plan__container">
            <div className="plan__features--wrapper">
              <div className="plan__features">
                <figure className="plan__features--icon">
                  <AiFillFileText />
                </figure>
                <div className="plan__features--text"><b>Key ideas in few min</b> with many books to read</div>
              </div>
              <div className="plan__features">
                <figure className="plan__features--icon">
                  <RiPlantFill />
                </figure>
                <div className="plan__features--text"><b>3 million</b> people growing with Summarist everyday</div>
              </div>
              <div className="plan__features">
                <figure className="plan__features--icon">
                  <FaHandshake />
                </figure>
                <div className="plan__features--text"><b>Precise recommendations</b> collections curated by experts
                </div>
              </div>
            </div>
            <div className="section__title">Choose the plan that fits you</div>
            <div
              className={`plan__card${selectedPlan === "premium" ? " plan__card--active" : ""}`}
              onClick={() => setSelectedPlan("premium")}
            >
              <div className="plan__card--circle">
                {selectedPlan === "premium" && <div className="plan__card--dot"></div>}
              </div>
              <div className="plan__card--content">
                <div className="plan__card--title">Premium Plus Yearly</div>
                <div className="plan__card--price">$99.99/year</div>
                <div className="plan__card--text">7-day free trial included</div>
              </div>
            </div>
            <div className="plan__card--separator"> or </div>
            <div
              className={`plan__card${selectedPlan === "basic" ? " plan__card--active" : ""}`}
              onClick={() => setSelectedPlan("basic")}
            >
              <div className="plan__card--circle">
                {selectedPlan === "basic" && <div className="plan__card--dot"></div>}
              </div>
              <div className="plan__card--content">
                <div className="plan__card--title">Premium Monthly</div>
                <div className="plan__card--price">$9.99/month</div>
                <div className="plan__card--text">No trial included</div>
              </div>
            </div>
            <div className="plan__card--cta">
              <span className="btn__wrapper">
                <button className="plan__btn">
                  <span>Start your free 7-day trial</span>
                </button>
              </span>
              <div className="plan__disclaimer">Cancel your trial at any time before it ends, and you wont be charged.</div>
            </div>
            <div className="faq__wrapper">
              <div className="accordion__card accordion__card--open">
                <div className="accordion__header">
                  <div className="accordion__title">How does the free 7-day trial work?</div>
                  <div className="accordion__icon accordion__icon--rotate">
                    <FaChevronUp />
                  </div>
                </div>
                <div className="collapse">
                  <div className="accordion__body">Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.
                  </div>
                </div>
              </div>
              <div className="accordion__card">
                <div className="accordion__header">
                  <div className="accordion__title">Can I switch subscriptions from monthly to yearly, or yearly to monthly?</div>
                  <div className="accordion__icon accordion__icon--rotate">
                    <FaChevronUp />
                  </div>
                </div>
                <div className="collapse">
                  <div className="accordion__body">While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.
                  </div>
                </div>
              </div>
              <div className="accordion__card">
                <div className="accordion__header">
                  <div className="accordion__title">What's included in the Premium plan?</div>
                  <div className="accordion__icon accordion__icon--rotate">
                    <FaChevronUp />
                  </div>
                </div>
                <div className="collapse">
                  <div className="accordion__body">Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.
                  </div>
                </div>
              </div>
              <div className="accordion__card">
                <div className="accordion__header">
                  <div className="accordion__title">Can I cancel during my trial or subscription?</div>
                  <div className="accordion__icon accordion__icon--rotate">
                    <FaChevronUp />
                  </div>
                </div>
                <div className="collapse">
                  <div className="accordion__body">You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="footer">
          <div className="footer__container">
            <div className="footer__row">
              <div className="footer__top--wrapper">
                <div className="footer__block">
                  <div className="footer__link--title">Actions</div>
                  <div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Summarist Magazine</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Cancel Subscription</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Help</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Contact us</a>
                    </div>
                  </div>
                </div>
                <div className="footer__block">
                  <div className="footer__link--title">Useful Links</div>
                  <div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Pricing</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Summarist Business</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Gift Cards</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Authors & Publishers</a>
                    </div>
                  </div>
                </div>
                <div className="footer__block">
                  <div className="footer__link--title">Company</div>
                  <div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">About</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Careers</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Partners</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Code of Conduct</a>
                    </div>
                  </div>
                </div>
                <div className="footer__block">
                  <div className="footer__link--title">Other</div>
                  <div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Sitemap</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Legal Notice</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Terms of Service</a>
                    </div>
                    <div className="footer__link--wrapper">
                      <a href="" className="footer__link">Privacy Policies</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer__copyright--wrapper">
                <div className="footer__copyright">Copyright &copy; 2026 Summarist</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Plan;
