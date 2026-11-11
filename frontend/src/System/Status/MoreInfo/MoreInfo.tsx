import React from 'react';
import DescriptionList from 'Components/DescriptionList/DescriptionList';
import DescriptionListItemDescription from 'Components/DescriptionList/DescriptionListItemDescription';
import DescriptionListItemTitle from 'Components/DescriptionList/DescriptionListItemTitle';
import FieldSet from 'Components/FieldSet';
import Link from 'Components/Link/Link';
import translate from 'Utilities/String/translate';

// Midgar: its own links. Midgar is built on Sonarr, whose wiki still explains
// most settings.
function MoreInfo() {
  return (
    <FieldSet legend={translate('MoreInfo')}>
      <DescriptionList>
        <DescriptionListItemTitle>
          {translate('HomePage')}
        </DescriptionListItemTitle>
        <DescriptionListItemDescription>
          <Link to="https://github.com/AnimaTheAeon/Midgar">
            github.com/AnimaTheAeon/Midgar
          </Link>
        </DescriptionListItemDescription>

        <DescriptionListItemTitle>Releases</DescriptionListItemTitle>
        <DescriptionListItemDescription>
          <Link to="https://github.com/AnimaTheAeon/Midgar/releases">
            github.com/AnimaTheAeon/Midgar/releases
          </Link>
        </DescriptionListItemDescription>

        <DescriptionListItemTitle>Report a problem</DescriptionListItemTitle>
        <DescriptionListItemDescription>
          <Link to="https://github.com/AnimaTheAeon/Midgar/issues">
            github.com/AnimaTheAeon/Midgar/issues
          </Link>
        </DescriptionListItemDescription>

        <DescriptionListItemTitle>Settings help</DescriptionListItemTitle>
        <DescriptionListItemDescription>
          <Link to="https://wiki.servarr.com/sonarr">
            wiki.servarr.com/sonarr
          </Link>{' '}
          (Sonarr's wiki; Midgar's settings work the same way)
        </DescriptionListItemDescription>

        <DescriptionListItemTitle>Built on</DescriptionListItemTitle>
        <DescriptionListItemDescription>
          <Link to="https://github.com/Sonarr/Sonarr/">Sonarr</Link>
        </DescriptionListItemDescription>
      </DescriptionList>
    </FieldSet>
  );
}

export default MoreInfo;
