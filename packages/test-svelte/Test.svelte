<script lang="ts">
  const message = $state("hello");
  const foo: number[] = [1, 2, 3];
  // eslint-disable-next-line no-console -- `eslint` should validate this.
  $effect(() => console.log(message, foo));
</script>

<h1>{message}</h1>
<!-- eslint-disable-next-line svelte/no-not-function-handler -- `svelte` should validate this. -->
<button onclick={message as any}>Click me</button>
