# IPS XML Sample Payloads

The files in this directory provide ready-to-send ISO20022 request bodies for
manual testing of the Instant Payment Service API.

| File | Description | Primary fields you may want to tweak |
| ---- | ----------- | ------------------------------------ |
| `service-request.xml` | Sample `pacs.008` credit transfer request for `/ips-payments/service-requests`. | Instruction IDs, debtor/creditor parties, amount. |
| `health-check.xml` | Sample `admn.005` echo request for `/ips-payments/health-checks`. | Message IDs and BIC codes. |
| `credit-status.xml` | Sample `pacs.002` status report for `/credit-status`. | Transaction status values and original references. |

## Usage tips

* Keep the `Content-Type: application/xml` header when posting the payloads.
* Replace placeholder identifiers (e.g., `MSG202405010001`) with values that
  make sense for your testing scenario.
* Duplicate a file when experimenting with multiple permutations so the base
  samples remain intact.
