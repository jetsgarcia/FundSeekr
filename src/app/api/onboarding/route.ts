import prisma from "@/lib/prisma";
import { stackServerApp } from "@/stack";
import { mapInvestorTypeToEnum } from "@/lib/mapInvestorTypeToEnum";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await stackServerApp.getUser();

    const { step, userType, ...rest } = body;

    // Validations
    if (!user) {
      return Response.json(
        {
          message: "User not authenticated",
          success: false,
        },
        { status: 401 }
      );
    }

    if (step !== 3) {
      return Response.json(
        {
          message: "Data will only be saved at step 3",
          success: false,
        },
        { status: 400 }
      );
    }

    try {
      const existingInvestor = await prisma.investors.findFirst({
        where: {
          user_id: user.id,
        },
      });

      const existingStartup = await prisma.startups.findFirst({
        where: {
          user_id: user.id,
        },
      });

      if (existingInvestor || existingStartup) {
        return Response.json(
          {
            message: "User has already completed onboarding",
            success: false,
          },
          { status: 409 }
        );
      }
    } catch (error) {
      return Response.json(
        {
          message: "Error checking user data",
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    if (userType === "investor") {
      const mappedInvestorType = mapInvestorTypeToEnum(rest.investorType);

      try {
        const newInvestor = await prisma.investors.create({
          data: {
            organization: rest.organization,
            organization_website: rest.organizationWebsite,
            position: rest.position,
            investor_linkedin: rest.investorLinkedin,
            investor_type: mappedInvestorType,
            city: rest.city,
            key_contact_person_name: rest.keyContactPersonName,
            key_contact_number: rest.keyContactNumber,
            key_contact_linkedin: rest.keyContactLinkedin,
            decision_period_in_weeks: rest.decisionPeriodInWeeks,
            typical_check_size_in_php: rest.typicalCheckSizeInPhp,
            user_id: user.id,
          },
        });

        await user.update({
          displayName: rest.firstName + " " + rest.lastName,
          serverMetadata: {
            onboarded: true,
            userType: "Investor",
          },
        });

        return Response.json(
          {
            message: "Investor created successfully",
            success: true,
            data: newInvestor,
          },
          { status: 201 }
        );
      } catch (error) {
        return Response.json(
          {
            message: "Error creating investor",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 400 }
        );
      }
    } else if (userType === "startup") {
      const newStartup = await prisma.startups.create({
        data: {
          name: rest.name,
          website: rest.website,
          description: rest.description,
          city: rest.city,
          date_founded: new Date(rest.dateFounded),
          keywords: rest.keywords
            .split(",")
            .map((keyword: string) => keyword.trim()),
          industry: rest.industry,
          user_id: user.id,
        },
      });

      await user.update({
        displayName: rest.firstName + " " + rest.lastName,
        serverMetadata: {
          onboarded: true,
          userType: "Startup",
        },
      });

      return Response.json(
        {
          message: "Startup created successfully",
          success: true,
          data: newStartup,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        message: "Error processing request",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
