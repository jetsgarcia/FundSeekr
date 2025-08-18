import prisma from "@/lib/prisma";
import { stackServerApp } from "@/stack";
import { investor_type_enum } from "@prisma/client";

function mapInvestorTypeToEnum(
  displayValue: string
): investor_type_enum | null {
  const mapping: { [key: string]: investor_type_enum } = {
    "Angel investor": investor_type_enum.Angel_investor,
    "Crowdfunding investor": investor_type_enum.Crowdfunding_investor,
    "Venture capital": investor_type_enum.Venture_capital,
    "Corporate investor": investor_type_enum.Corporate_investor,
    "Private equity": investor_type_enum.Private_equity,
    "Impact investor": investor_type_enum.Impact_investor,
  };

  return mapping[displayValue] || null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await stackServerApp.getUser();

    const { step, userType, ...rest } = body;

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

    if (userType === "investor") {
      // Validate investor type
      const mappedInvestorType = mapInvestorTypeToEnum(rest.investorType);
      if (!mappedInvestorType) {
        return Response.json(
          {
            message: `Invalid investor type: ${rest.investorType}`,
            success: false,
          },
          { status: 400 }
        );
      }

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

        user.update({
          serverMetadata: {
            onboarded: true,
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
        console.log(error);

        return Response.json(
          {
            message: "Error creating investor",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 400 }
        );
      }
    } else {
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

      user.update({
        serverMetadata: {
          onboarded: true,
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
    console.log(error);
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
