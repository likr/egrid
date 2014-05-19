# -*- coding: utf-8 -*-

## Copyright (c) 2014, https://code.google.com/p/kay-framework/
## All rights reserved.
##
## Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
##
## 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
##
## 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
##
## 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
##
## THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
from google.appengine.ext import db
from datetime import datetime

class DeletableModelBase(db.Model):
    deleted_at = db.DateTimeProperty(default=None)

    @classmethod
    def all(cls, **kwds):
        return super(DeletableModelBase, cls).all(**kwds).filter('deleted_at =', None)

    @classmethod
    def retrieve(cls, **kwds):
        return super(DeletableModelBase, cls).all(**kwds)

    @classmethod
    def all_deleted(cls):
        return cls.original_all().filter('deleted_at >', None).order('-deleted_at')

    def remove(self):
        self.deleted_at = datetime.now()
        self.put()

    def delete(self, **kwds):
        return super(DeletableModelBase, self).delete(**kwds)

    def revive(self):
        self.deleted_at = None
        self.put()
