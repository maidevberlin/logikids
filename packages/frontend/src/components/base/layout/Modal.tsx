import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ReactNode } from 'react'
import { FadeInOut } from '../Animations/FadeInOut'
import { Button } from '../Button/Button'
import { Card } from '../Card/Card'
import { position, spacing } from '../styles'
import { cn } from '../styles/utils'

type ModalWidth = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: ReactNode
  showCloseButton?: boolean
  maxWidth?: ModalWidth
  minWidth?: ModalWidth
}

const widthClasses = {
  sm: {
    min: 'min-w-[24rem]',
    max: 'max-w-sm'
  },
  md: {
    min: 'min-w-[28rem]',
    max: 'max-w-md'
  },
  lg: {
    min: 'min-w-[32rem]',
    max: 'max-w-lg'
  },
  xl: {
    min: 'min-w-[36rem]',
    max: 'max-w-xl'
  }
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  maxWidth = 'xl',
  minWidth = 'lg'
}: ModalProps) {
  return (
    <FadeInOut show={isOpen}>
      <Dialog
        as="div"
        className={cn(position.fixed, 'inset-0 z-50')}
        onClose={onClose}
        open={isOpen}
      >
        <div className={cn(position.fixed, 'inset-0 bg-gray-500/75')} />

        <div className={cn(position.fixed, 'inset-0 z-10', spacing.padding.md, 'overflow-y-auto')}>
          <div className="flex min-h-full items-center justify-center">
            <FadeInOut show={isOpen} direction="down">
              <Dialog.Panel 
                className={cn(
                  'w-full',
                  widthClasses[minWidth].min,
                  widthClasses[maxWidth].max
                )}
              >
                <Card elevated className="relative">
                  {showCloseButton && (
                    <div className={cn(position.absolute, 'right-4 top-4')}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className={spacing.padding.sm}
                        aria-label="Close"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  )}

                  {title && (
                    <div className={cn(spacing.margin.lg)}>
                      {title}
                    </div>
                  )}

                  {children}
                </Card>
              </Dialog.Panel>
            </FadeInOut>
          </div>
        </div>
      </Dialog>
    </FadeInOut>
  )
} 