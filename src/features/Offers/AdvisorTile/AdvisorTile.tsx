import avatarImgSrc from '@assets/avatar.png';
import { Heading } from '@components/Heading';
import { Icon } from '@components/Icon';
import { Link } from '@components/Link';
import { Tile } from '@components/Tile';
import { Typo } from '@components/Typo';
import { useTranslation } from '../hooks';
import { Advisor } from '../interfaces';

import './AdvisorTile.scss';

import * as React from 'react';

export const getAdvisorFullName = (advisor: Advisor | undefined | null) => {
  if (!advisor) {
    return undefined;
  }
  const firstName = advisor.firstName ? `${advisor.firstName} ` : '';
  const lastName = advisor.lastName ?? '';
  return `${firstName}${lastName}`;
};

type AdvisorTileProps = {
  /** advisor obj from api response */
  advisor: Advisor;
  anchorLink: string;
  children?: never;
};

/**
 * responsive component to render tile with informations about advisor, taken by prop
 */
export const AdvisorTile: React.FC<AdvisorTileProps> = ({ advisor, anchorLink }) => {

  const t = useTranslation();

  const fullName = getAdvisorFullName(advisor);
  const imageName = advisor.mail ? advisor.mail.split('@')[0].toLowerCase() : '';
  const imageUrl = `https://www.axa.ch/content/dam/axa/agents/${ imageName }.jpg/_jcr_content/renditions/original`;

  return (
    <Tile
      anchorNavId={ anchorLink }
      className={ 'AdvisorTile' }
    >
      <div>
        <img
          src={imageUrl}
          alt={fullName ?? 'advisor full name'}
          style={{ backgroundImage: `url(${avatarImgSrc})` }}
          className={'AdvisorTile__image'}
          onError={(e) => {
            (e.target as EventTarget & HTMLImageElement).src = avatarImgSrc;
          }}
        />
      </div>
      <div className="AdvisorTile__contentWrapper">
        <div className="AdvisorTile__textWrapper--1col">
          <Typo size={'t1'} fontStyle={'semibold'} tag={'span'}>{t('Offers.offersOverviewAgent.label')}</Typo>
          {(advisor.firstName || advisor.lastName) && (
            <Heading rank={5}>{fullName}</Heading>
          )}
        </div>
        <div className="AdvisorTile__textWrapper--2col">
          <div className="AdvisorTile__detailsWrapper">
            <div className="AdvisorTile__IconTextBlock">
              <div className={'AdvisorTile__IconTextBlockIcon'}>
                <Icon icon={'location_on'}/>
              </div>
              <div className="AdvisorTile__IconTextBlockText">
                {advisor.street && (
                  <Typo className="AdvisorTile__IconTextSpan" size={'t2'} tag={'span'}>{advisor.street}</Typo>
                )}
                {(advisor.postalCode || advisor.city) && (
                  <Typo className="AdvisorTile__IconTextSpan" size={'t2'} tag={'span'}>{advisor.postalCode} {advisor.city}</Typo>
                )}
              </div>
            </div>
          </div>
          <div className="AdvisorTile__detailsWrapper">
            {advisor.mail && (
              <div className="AdvisorTile__IconTextBlock">
                <div className={'AdvisorTile__IconTextBlockIcon'}>
                  <Icon icon={'mail'}/>
                </div>
                <div className="AdvisorTile__IconTextBlockText">
                  <Link href={`mailto:${advisor.mail}`}>
                    <Typo size={'t2'} tag={'span'}>{advisor.mail}</Typo>
                  </Link>
                </div>
              </div>
            )}
            {advisor.phoneNumber && (
              <div className="AdvisorTile__IconTextBlock">
                <div className={'AdvisorTile__IconTextBlockIcon'}>
                  <Icon icon={'phone'}/>
                </div>
                <div className="AdvisorTile__IconTextBlockText">
                  <Link href={`tel:${advisor.phoneNumber}`}>
                    <Typo size={'t2'} tag={'span'}>{advisor.phoneNumber}</Typo>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </Tile>
  );
};
