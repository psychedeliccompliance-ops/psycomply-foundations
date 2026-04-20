import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface NewLeadNotificationProps {
  leadEmail?: string
  firstName?: string
  stateSlug?: string
  practiceType?: string
  timestamp?: string
}

const NewLeadNotificationEmail = ({
  leadEmail,
  firstName,
  stateSlug,
  practiceType,
  timestamp,
}: NewLeadNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New PsyComply lead: {leadEmail ?? 'unknown'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New PsyComply Lead</Heading>
        <Text style={text}>A new lead just signed up through the site.</Text>

        <Section style={card}>
          <Row label="Email" value={leadEmail ?? '—'} />
          <Row label="First name" value={firstName ?? '—'} />
          <Row label="State" value={stateSlug ?? '—'} />
          <Row label="Practice type" value={practiceType ?? '—'} />
          <Row label="Submitted at" value={timestamp ?? '—'} />
        </Section>

        <Text style={footer}>Sent automatically by PsyComply.</Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label, value }: { label: string; value: string }) => (
  <Text style={rowText}>
    <span style={rowLabel}>{label}: </span>
    <span style={rowValue}>{value}</span>
  </Text>
)

export const template = {
  component: NewLeadNotificationEmail,
  subject: (data: Record<string, any>) =>
    `New PsyComply Lead: ${data?.leadEmail ?? 'unknown'}`,
  displayName: 'New lead notification',
  to: 'psychedeliccompliance@gmail.com',
  previewData: {
    leadEmail: 'jane@example.com',
    firstName: 'Jane',
    stateSlug: 'colorado',
    practiceType: 'Ketamine clinic',
    timestamp: new Date().toISOString(),
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Georgia, "Times New Roman", serif',
}
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'normal' as const,
  color: '#2C4A3E',
  margin: '0 0 16px',
}
const text = {
  fontSize: '15px',
  color: '#3a3a3a',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const card = {
  backgroundColor: '#F5F0E8',
  border: '1px solid #e6dfd2',
  borderRadius: '8px',
  padding: '20px 24px',
  margin: '0 0 24px',
}
const rowText = { fontSize: '14px', color: '#2a2a2a', margin: '8px 0' }
const rowLabel = { color: '#2C4A3E', fontWeight: 600 }
const rowValue = { color: '#1f1f1f' }
const footer = {
  fontSize: '12px',
  color: '#888',
  margin: '24px 0 0',
  fontFamily: 'Arial, sans-serif',
}