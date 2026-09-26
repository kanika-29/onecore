# Global Development Rules

These rules apply to all software development, debugging, refactoring, architecture, backend, frontend, database, DevOps, and deployment work unless explicitly overridden.

## 1. Production-Ready Code Over MVPs

Never build intentionally disposable, toy, or MVP-quality implementations unless explicitly requested.

Build with production use in mind:

* Clean architecture
* Strong typing
* Maintainable code
* Proper validation
* Secure data handling
* Robust error handling
* Testability
* Observability
* Scalability
* Reliable failure handling

Do not over-engineer simple features. Use the simplest architecture that is genuinely production-safe.

## 2. Understand Before Coding

Do not immediately start generating or modifying code.

First understand:

* What the user actually needs
* How the existing system works
* Which files/components/services are involved
* Existing architecture and conventions
* Data flow
* Dependencies
* Existing APIs and database structure
* Potential side effects

Inspect and reuse existing functionality before creating new abstractions.

Never rewrite working code simply because another implementation looks cleaner.

## 3. Minimal and Focused Changes

Make the smallest change that correctly solves the problem.

Do not unnecessarily:

* Rewrite entire files
* Refactor unrelated code
* Replace working libraries
* Change architecture without reason
* Rename unrelated variables/components
* Modify unrelated database structures

Every change should have a clear reason.

## 4. Architecture and Separation of Concerns

Keep responsibilities separated.

UI components should primarily handle presentation and interaction.

Business rules should live in appropriate services/domain logic.

Database access should remain separated from business logic where the architecture calls for it.

API routes/controllers should not become large containers for business logic.

Avoid:

* God classes
* God components
* Giant functions
* Duplicated business logic
* Circular dependencies
* Unnecessary abstractions

Design the code so another developer can understand where a responsibility belongs.

## 5. Strong Error Handling

Every critical operation must have an intentional failure path.

Handle failures from:

* Database operations
* APIs
* Network requests
* Authentication
* Authorization
* File operations
* Background jobs
* External services
* User input
* Unexpected runtime conditions

Never silently swallow errors.

Errors should be:

* Meaningful
* Logged appropriately
* Safe for the user
* Safe for production
* Recoverable where possible

Do not expose internal errors, stack traces, credentials, or sensitive system information to users.

## 6. Security by Default

Treat all external input as untrusted.

Always consider:

* Authentication
* Authorization
* RBAC/permissions
* Input validation
* SQL injection
* XSS
* CSRF
* SSRF
* IDOR/broken access control
* File-upload security
* Rate limiting
* Session/token security
* Secret management
* Data exposure

Never hardcode passwords, API keys, tokens, private keys, or production credentials.

Never rely only on frontend restrictions for security.

Backend authorization must independently protect protected resources.

## 7. Database and API Quality

Database operations must prioritize correctness and performance.

Use appropriate:

* Indexes
* Constraints
* Transactions
* Pagination
* Query optimization
* Connection pooling
* Data validation

Avoid unnecessary queries, N+1 queries, retrieving excessive data, and database operations inside inefficient loops.

APIs should have clear:

* Input contracts
* Output contracts
* Validation
* Authentication requirements
* Authorization requirements
* Error responses
* Status codes

Treat third-party APIs as unreliable dependencies. Handle timeouts, failures, rate limits, and retries appropriately.

## 8. Scalability and Performance

Do not use brute-force solutions when a reasonable scalable solution exists.

Consider:

* Algorithmic complexity
* Database query performance
* Indexing
* Caching
* Pagination
* Lazy loading
* Batching
* API-call reduction
* Memory usage
* CPU usage
* Concurrency
* Background processing

Do not prematurely add complicated infrastructure.

Optimize based on the actual bottleneck rather than assumptions.

## 9. Premium UI/UX

All frontend work should be treated as production UI, not prototype UI.

Build interfaces that are:

* Modern
* Consistent
* Responsive
* Accessible
* Intuitive
* Visually polished
* Fast
* Production-ready

Avoid generic placeholder interfaces, unfinished layouts, inconsistent spacing, arbitrary colors, poor typography, and unnecessary visual effects.

Every meaningful asynchronous operation should properly handle:

* Loading
* Success
* Empty
* Error
* Retry where appropriate

The UI must remain usable when data is missing, slow, incorrect, or unavailable.

## 10. No Fake or Placeholder Functionality

Never pretend something works when it does not.

Do not:

* Hardcode dynamic data
* Fake API responses
* Hide errors
* Return success after failed operations
* Leave misleading placeholder implementations
* Claim an integration works without verification

If something cannot be completed because required infrastructure, credentials, configuration, or information is missing, state exactly what is missing.

## 11. Correctness and Edge Cases

Do not implement only the happy path.

Consider:

* Empty data
* Null/undefined values
* Invalid input
* Duplicate requests
* Duplicate records
* Missing resources
* Expired authentication
* Permission failures
* Network failures
* API timeouts
* Concurrent updates
* Large datasets
* Boundary values
* Invalid dates/timezones
* Partial failures

For important operations such as payments, bookings, inventory, orders, and data mutations, consider idempotency and race conditions.

## 12. Testing and Verification

Code is not considered complete merely because it was written.

Before declaring a task complete, verify the affected functionality.

Use appropriate:

* Type checking
* Linting
* Unit tests
* Integration tests
* API tests
* Component tests
* End-to-end tests
* Build verification
* Manual verification

When fixing a bug, verify the original failure and consider adding a regression test.

Review the final changes for unintended side effects.

## 13. Observability and Maintainability

Production systems should be diagnosable.

Use meaningful structured logging for important:

* Errors
* Authentication failures
* Authorization failures
* External API failures
* Database failures
* Background-job failures
* Important business events

Never log secrets or sensitive information unnecessarily.

Code should be readable and understandable without requiring the original author to explain every line.

Prefer clear code over clever code.

## 14. Root-Cause Fixes

When debugging, do not simply hide symptoms.

Determine:

1. What failed?
2. Why did it fail?
3. Where did the incorrect state originate?
4. Why was the failure allowed to reach the user?
5. What is the correct fix?
6. How can recurrence be prevented?

Prefer fixing the underlying cause instead of adding temporary patches.

## 15. Developer Learning / Anti-Vibe-Coding Rule

The agent must not optimize for generating the maximum amount of code.

When helping the developer:

* Explain the reasoning behind the implementation.
* Explain where the change belongs.
* Explain important concepts being used.
* Show focused snippets when they are sufficient.
* Avoid dumping entire files unnecessarily.
* Do not hide important logic behind unexplained abstractions.
* Make the developer capable of understanding and maintaining the implementation.

When the developer asks for a complete implementation, prefer teaching the structure and key parts first unless a complete implementation is genuinely necessary.

The goal is:

**Understand → Plan → Implement → Verify → Learn**

not:

**Prompt → Generate → Copy → Hope**

## 16. Final Engineering Check

Before considering substantial work complete, verify:

* Is it correct?
* Is it secure?
* Is it maintainable?
* Does it handle failure?
* Does it handle invalid input?
* Does it preserve existing functionality?
* Does it scale reasonably?
* Are there obvious edge cases?
* Has the implementation actually been verified?
* Is there unnecessary complexity?
* Can another developer understand it?

If an important answer is unknown, do not claim the work is fully verified.

## Engineering Principle

Always optimize for:

**Correctness → Security → Reliability → Maintainability → Scalability → Performance → UX → Speed**

The objective is not to write more code.

The objective is to build software that works reliably in the real world and can be understood, tested, maintained, and extended by developers in the future.
