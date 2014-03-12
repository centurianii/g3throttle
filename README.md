g3throttle
==========
<p>A throttle function that restricts it's external calls with the ability to pass arguments even if calls don't allow this!</p>
<p>Moreover, we can pass the context that <code>this</code> refers to inside the function!</p>

Usage
=====
<p>In place of a function name like <code>myFunction</code> pass <code>g3.throttle(myFunction, time[, this[, arg1, ...]])</code> and that's it!</p>
<p>Now, your function won't be called more than every <code>time ms</code> and arguments <code>arg1, arg2, ...</code> have been passed already!</p>

Dependencies
============
None.

Evaluator test page
===================
<p>A test on <a href='http://benalman.com/projects/jquery-throttle-debounce-plugin/'>Ben Alman's</a> and <a href='http://underscorejs.org/#throttle'>Underscore's</a> throttle functions compared with this one.</p>
<p>See: <a href="http://centurianii.github.io/g3throttle/">g3throttle</a></p>

Have fun!
