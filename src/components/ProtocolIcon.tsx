import React from 'react'
import { Avatar } from '@chakra-ui/react'
import { components } from '../types/schema/swagger'

interface ProtocolIconProps {
  protocol: components['schemas']['Protocol']
}

const ProtocolIcon: React.VFC<ProtocolIconProps> = ({ protocol }) => {
  const src = protocol.icons?.find((icon) => icon.size === 'large')?.url || protocol.icons?.[0].url
  return <Avatar src={src} size="sm" marginRight="3" />
}

export default ProtocolIcon
