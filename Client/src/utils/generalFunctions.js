import { getPricingPlans, specialPlans } from "./pricingData";
export const getPlanFeatures = (userPlanName, billingPeriod = "monthly") => {
  const allPlans = [
    ...getPricingPlans("monthly"),
    ...getPricingPlans("yearly"),
    ...specialPlans,
  ];

  // For special plans, just find by name
  if (userPlanName === "One Day Event" || userPlanName === "Free Trial") {
    const plan = allPlans.find(
      (p) => p.name === userPlanName || p.name === "One-Day Event"
    );
    return plan?.features || [];
  }

  // For regular plans, extract the base plan name from compound names like "Basic Monthly" -> "Basic"
  let basePlanName = userPlanName;
  if (userPlanName) {
    // Remove "Monthly" or "Yearly" from plan names
    basePlanName = userPlanName.replace(/\s+(Monthly|Yearly)$/i, "");
  }

  // Get the correct plan array based on billing period
  const targetPlans =
    billingPeriod === "yearly"
      ? getPricingPlans("yearly")
      : getPricingPlans("monthly");

  // Find the plan by base name
  const plan = targetPlans.find((p) => p.name === basePlanName);

  return plan?.features || [];
};
