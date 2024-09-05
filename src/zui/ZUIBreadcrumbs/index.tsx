import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import {
  Box,
  Link,
  Menu,
  SvgIconTypeMap,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import {
  MoreHoriz,
  SubdirectoryArrowLeft,
  SubdirectoryArrowRight,
} from '@mui/icons-material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import { Msg } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';

const useStyles = makeStyles((theme) => ({
  leftSide: {
    alignItems: 'center',
    backgroundColor: theme.palette.grey[50],
    borderRadius: '2em 0 0 2em',
    borderRight: `1px solid ${theme.palette.grey[200]}`,
    display: 'flex',
    height: '26px',
  },
  rightSide: {
    alignItems: 'center',
    backgroundColor: theme.palette.grey[50],
    borderRadius: '0 2em 2em 0',
    cursor: 'pointer',
    display: 'flex',
    height: '26px',
  },
}));

export interface BreadcrumbTreeItem {
  href: string;
  icon?: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
  title: string;
  children: BreadcrumbTreeItem[] | [];
}

const BreadCrumbSibling: FC<{
  children: ReactNode;
  isCurrentItem: boolean;
  isLast: boolean;
  item: BreadcrumbTreeItem;
}> = ({ children, item, isCurrentItem, isLast }) => {
  const theme = useTheme();
  const Icon = item.icon;
  return (
    <Box>
      <NextLink href={item.href} legacyBehavior passHref>
        <Link underline="none">
          <Box
            alignItems="center"
            display="flex"
            paddingBottom={isLast ? '' : 1}
          >
            {Icon ? (
              <Icon
                sx={{
                  color: theme.palette.grey[300],
                  fontSize: '20px',
                  marginRight: '6px',
                }}
              />
            ) : (
              ''
            )}
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: isCurrentItem ? 'bold' : 'normal',
              }}
            >
              {item.title}
            </Typography>
          </Box>
        </Link>
      </NextLink>
      {children}
    </Box>
  );
};

const Breadcrumb: FC<{
  children: ReactNode;
  isLastLevel: boolean;
  isTopLevel: boolean;
}> = ({ children, isTopLevel, isLastLevel }) => {
  const theme = useTheme();
  return (
    <Box display="flex">
      {!isTopLevel ? (
        <SubdirectoryArrowRight
          sx={{
            color: theme.palette.grey[200],
            fontSize: '20px',
            marginRight: 0.5,
          }}
        />
      ) : (
        ''
      )}
      <Box
        display={isLastLevel ? 'flex' : undefined}
        flexDirection={isLastLevel ? 'column' : undefined}
      >
        {children}
      </Box>
    </Box>
  );
};

const renderTree = (
  breadcrumbs: BreadcrumbTreeItem[],
  currentItemHref: string,
  isTopLevel: boolean,
  parentHref: string
) => {
  const isLastLevel = !breadcrumbs[0].children.length;
  return (
    <Breadcrumb isLastLevel={isLastLevel} isTopLevel={isTopLevel}>
      {breadcrumbs.slice(0, 9).map((item, index) => (
        <BreadCrumbSibling
          key={item.href}
          isCurrentItem={currentItemHref == item.href}
          isLast={isLastLevel && index == breadcrumbs.length - 1}
          item={item}
        >
          {!isLastLevel
            ? renderTree(item.children, currentItemHref, false, parentHref)
            : ''}
        </BreadCrumbSibling>
      ))}
      {breadcrumbs.length > 9 && (
        <NextLink href={parentHref} legacyBehavior passHref>
          <Link>
            <Typography sx={{ fontSize: '14px' }}>
              <Msg
                id={messageIds.breadcrumbs.showMore}
                values={{ number: breadcrumbs.length - 9 }}
              />
            </Typography>
          </Link>
        </NextLink>
      )}
    </Breadcrumb>
  );
};

const findCurrentItem = (
  breadcrumbs: BreadcrumbTreeItem[]
): BreadcrumbTreeItem => {
  const crumb = breadcrumbs[0];
  if (crumb.children.length === 0) {
    return crumb;
  } else {
    return findCurrentItem(crumb.children);
  }
};

const findParentItem = (
  currentItem: BreadcrumbTreeItem,
  breadcrumbs: BreadcrumbTreeItem[]
): BreadcrumbTreeItem => {
  const crumb = breadcrumbs[0];
  if (crumb.children.find((item) => item.href === currentItem.href)) {
    return crumb;
  } else {
    return findParentItem(currentItem, crumb.children);
  }
};

interface ZUIBreadcrumbsProps {
  breadcrumbs: BreadcrumbTreeItem[];
}

const ZUIBreadcrumbs: FC<ZUIBreadcrumbsProps> = ({ breadcrumbs }) => {
  const classes = useStyles();
  const [breadcrumbsAnchorEl, setBreadcrumbsAnchorEl] =
    useState<Element | null>(null);

  const currentItem = findCurrentItem(breadcrumbs);
  const parentItem = findParentItem(currentItem, breadcrumbs);

  return (
    <Box alignItems="center" display="inline-flex">
      <NextLink href={parentItem.href || ''}>
        <Box className={classes.leftSide}>
          <SubdirectoryArrowLeft
            color="secondary"
            sx={{
              fontSize: '1rem',
              margin: '4px 4px 4px 6px',
              transform: 'rotate(0.25turn)',
            }}
          />
        </Box>
      </NextLink>
      <Box
        className={classes.rightSide}
        onClick={(ev) =>
          setBreadcrumbsAnchorEl(breadcrumbsAnchorEl ? null : ev.currentTarget)
        }
      >
        <MoreHoriz
          color="secondary"
          sx={{ fontSize: '1.125rem', margin: '4px 6px 4px 4px' }}
        />
        <Menu
          anchorEl={breadcrumbsAnchorEl}
          onClose={() => setBreadcrumbsAnchorEl(null)}
          open={!!breadcrumbsAnchorEl}
          PaperProps={{ sx: { boxShadow: '0px 4px 20px 0px #0000001F' } }}
        >
          <Box paddingX={2}>
            {renderTree(breadcrumbs, currentItem?.href, true, parentItem.href)}
          </Box>
        </Menu>
      </Box>
    </Box>
  );
};

export default ZUIBreadcrumbs;