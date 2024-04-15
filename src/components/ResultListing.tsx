import React from "react";
import NextLink from "next/link";
import {
  LinkBox,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
} from "@chakra-ui/react";
import { getAttributeFrom } from "../../static";

import type { GMetaResult } from "@/app/page";

export default function ResultListing({ gmeta }: { gmeta: GMetaResult }) {
  const heading = getAttributeFrom<string>(
    gmeta,
    "components.ResultListing.heading",
  );

  const summary = getAttributeFrom<string>(
    gmeta,
    "components.ResultListing.summary",
  );

  return (
    <LinkBox
      as={NextLink}
      href={`/results?subject=${encodeURIComponent(gmeta.subject)}`}
    >
      <Card size="sm" w="full">
        <CardHeader>
          <Heading size="md" color="brand">
            {heading}
          </Heading>
        </CardHeader>
        {summary && (
          <CardBody>
            <Text noOfLines={[3, 5, 10]}>{summary}</Text>
          </CardBody>
        )}
      </Card>
    </LinkBox>
  );
}
