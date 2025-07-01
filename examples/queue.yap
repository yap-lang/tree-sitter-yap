Queue (Data: Type):
    Node: (next: Node, prev: Node, data: Data)
    (head: Node, tail: Node)

pushFront (queue: Queue, node: Node):
    node.next: queue.head
    node.prev: null
    if queue.head:
        queue.head.prev: node
    else:
        queue.tail: node
    queue.head: node

pushBack (queue: Queue, node: Node):
    node.prev: queue.tail
    node.next: null
    if queue.tail:
        queue.tail.prev: node
    else:
        queue.head: node
    queue.tail: node

delete (queue: Queue, node: Node):
    if node.prev:
        node.prev.next: node.next
    else:
        queue.head: node.next
    if node.next:
        node.next.prev: node.prev
    else:
        queue.tail: node.prev

popFront (queue: Queue):
    if queue.head:
        queue delete (queue.head)

popBack (queue: Queue):
    if queue.tail:
        queue delete (queue.tail)
