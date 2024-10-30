import { Meta, StoryObj } from '@storybook/react';

import ZUILink from './index';
import ZUIText from 'zui/components/ZUIText';

const meta: Meta<typeof ZUILink> = {
  component: ZUILink,
  title: 'Components/ZUILink',
};
export default meta;

type Story = StoryObj<typeof ZUILink>;

export const LinkMd: Story = {
  args: {
    href: 'http://www.katt.org',
    message: 'a medium size link',
    size: 'medium',
  },
  render: function Render(args) {
    return (
      <ZUIText variant="bodyMdRegular">
        Hello this is <ZUILink {...args} /> inside of a ZUIText
      </ZUIText>
    );
  },
};

export const LinkSm: Story = {
  args: {
    href: 'http://www.zetkin.org',
    message: 'a small size link',
    size: 'small',
  },
  render: function Render(args) {
    return (
      <ZUIText>
        Hello this is <ZUILink {...args} /> inside of a ZUIText
      </ZUIText>
    );
  },
};
