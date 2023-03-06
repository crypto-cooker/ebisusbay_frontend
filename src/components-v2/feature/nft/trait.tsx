import {humanize, mapAttributeString, millisecondTimestamp, relativePrecision} from "@src/utils";
import Link from "next/link";
import React from "react";

interface TraitProps {
  title: string;
  value: any;
  valueDisplay?: string;
  percent?: number;
  occurrence?: number;
  type?: string;
  collectionAddress?: string;
  collectionSlug?: string;
  queryKey?: string;
}

const Trait = ({
 title,
 value,
 valueDisplay,
 percent,
 occurrence,
 type,
 collectionAddress,
 collectionSlug,
 queryKey,
}: TraitProps) => {
  const Value = () => {
    return (
      <h4>
        {value !== undefined ? (
          <>
            {type === 'date' ? (
              <>{new Date(millisecondTimestamp(value)).toDateString()}</>
            ) : (
              <>{mapAttributeString(valueDisplay ?? value, collectionAddress, title, true)}</>
            )}
          </>
        ) : (
          <>N/A</>
        )}
      </h4>
    );
  };

  return (
    <div className="col-lg-4 col-md-6 col-sm-6">
      <div className="nft_attr">
        <h5>{humanize(title)}</h5>
        {collectionSlug && queryKey && value ? (
          <Link
            href={{
              pathname: `/collection/${collectionSlug}`,
              query: { [queryKey]: JSON.stringify({ [title]: [value.toString()] }) },
            }}
          >
            <Value />
          </Link>
        ) : (
          <Value />
        )}
        {occurrence ? (
          <span>{relativePrecision(occurrence)}% have this trait</span>
        ) : (
          percent && <span>{percent}% have this trait</span>
        )}
      </div>
    </div>
  );
};

export default Trait;