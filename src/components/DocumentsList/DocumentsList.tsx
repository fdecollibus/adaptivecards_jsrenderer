import { Alert } from '@components/Alert';
import { Link } from '@components/Link';
import { Spacer } from '@components/Spacer';
import * as React from 'react';
import './DocumentsList.scss';
import cx from 'classnames';

export type DocumentsListItem = {
  /** formatted date string */
  date: string;
  key: string;
  /** translated string */
  label: string;
  onDownload: (setDownloadError: (downloadError: string | undefined) => void) => void;
};

type DocumentsListProps = {
  documents?: DocumentsListItem[];
  /**
   * Download error message displayed in an Alert (preset for storybook)
   */
  presetDownloadError?: string;
};

export const DocumentsList: React.FC<DocumentsListProps> = ({documents, presetDownloadError}) => {
  if (!documents) return null;

  const [downloadError, setDownloadError] = React.useState<string>(); // download error message displayed in an Alert

  // update preset for storybook
  React.useEffect(
    () => setDownloadError(presetDownloadError),
    [presetDownloadError],
  );

  return (
    <div className={cx('DocumentsList')}>
      {downloadError && (
        <>
          <Alert
            animate
            type="error"
          >
            {downloadError}
          </Alert>
          <Spacer/>
        </>
      )}
      {documents.map(link => (
        <div key={link.key} className={cx('DocumentLink')}>
          <div className={cx('DocumentLink__linkWrapper')}>
            <Link
              variant={'icon'}
              icon={'download'}
              onClick={() => link.onDownload(setDownloadError)}
            >
              {link.label}
            </Link>
          </div>
          <div className={cx('DocumentLink__date')}>
            {link.date}
          </div>
        </div>
      ))}
    </div>
  );
};
