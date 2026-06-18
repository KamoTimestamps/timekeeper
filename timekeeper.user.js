// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.0.18
// @description  Enhanced timestamp tool for YouTube videos with DVR/rewind enablement for live streams
// @author       Silent Shout
// @match        https://www.youtube.com/*
// @run-at       document-start
// @noframes
// @icon         https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @grant        GM.xmlHttpRequest
// @connect      *
// @homepageURL  https://github.com/KamoTimestamps/timekeeper
// @supportURL   https://github.com/KamoTimestamps/timekeeper/issues
// @downloadURL  https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @updateURL    https://raw.githubusercontent.com/KamoTimestamps/timekeeper/main/timekeeper.user.js
// @license MIT
// ==/UserScript==

(()=>{var Au=Object.defineProperty;var vs=(t,e)=>{for(var n in e)Au(t,n,{get:e[n],enumerable:!0})};var z={};vs(z,{BRAND:()=>Qu,DIRTY:()=>Fn,EMPTY_PATH:()=>Iu,INVALID:()=>H,NEVER:()=>Nd,OK:()=>qe,ParseStatus:()=>Ve,Schema:()=>J,ZodAny:()=>Ln,ZodArray:()=>cn,ZodBigInt:()=>Vn,ZodBoolean:()=>Gn,ZodBranded:()=>so,ZodCatch:()=>tr,ZodDate:()=>Un,ZodDefault:()=>er,ZodDiscriminatedUnion:()=>ti,ZodEffects:()=>kt,ZodEnum:()=>Xn,ZodError:()=>ct,ZodFirstPartyTypeKind:()=>F,ZodFunction:()=>ri,ZodIntersection:()=>Kn,ZodIssueCode:()=>S,ZodLazy:()=>Yn,ZodLiteral:()=>Jn,ZodMap:()=>Lr,ZodNaN:()=>Cr,ZodNativeEnum:()=>Qn,ZodNever:()=>Dt,ZodNull:()=>Zn,ZodNullable:()=>Gt,ZodNumber:()=>jn,ZodObject:()=>ut,ZodOptional:()=>yt,ZodParsedType:()=>L,ZodPipeline:()=>lo,ZodPromise:()=>In,ZodReadonly:()=>nr,ZodRecord:()=>ni,ZodSchema:()=>J,ZodSet:()=>Ir,ZodString:()=>Bn,ZodSymbol:()=>Mr,ZodTransformer:()=>kt,ZodTuple:()=>Vt,ZodType:()=>J,ZodUndefined:()=>qn,ZodUnion:()=>Wn,ZodUnknown:()=>ln,ZodVoid:()=>Br,addIssueToContext:()=>M,any:()=>ld,array:()=>pd,bigint:()=>rd,boolean:()=>Ms,coerce:()=>Od,custom:()=>Es,date:()=>od,datetimeRegex:()=>Ts,defaultErrorMap:()=>an,discriminatedUnion:()=>gd,effect:()=>Md,enum:()=>Ed,function:()=>xd,getErrorMap:()=>Er,getParsedType:()=>jt,instanceof:()=>td,intersection:()=>vd,isAborted:()=>Qo,isAsync:()=>_r,isDirty:()=>ei,isValid:()=>Mn,late:()=>ed,lazy:()=>Td,literal:()=>Sd,makeIssue:()=>ao,map:()=>kd,nan:()=>nd,nativeEnum:()=>_d,never:()=>ud,null:()=>sd,nullable:()=>Ld,number:()=>As,object:()=>md,objectUtil:()=>Ni,oboolean:()=>Pd,onumber:()=>Rd,optional:()=>Bd,ostring:()=>Dd,pipeline:()=>Cd,preprocess:()=>Id,promise:()=>Ad,quotelessJson:()=>Mu,record:()=>bd,set:()=>wd,setErrorMap:()=>Lu,strictObject:()=>fd,string:()=>_s,symbol:()=>id,transformer:()=>Md,tuple:()=>yd,undefined:()=>ad,union:()=>hd,unknown:()=>cd,util:()=>te,void:()=>dd});var te;(function(t){t.assertEqual=i=>{};function e(i){}t.assertIs=e;function n(i){throw new Error}t.assertNever=n,t.arrayToEnum=i=>{let o={};for(let s of i)o[s]=s;return o},t.getValidEnumValues=i=>{let o=t.objectKeys(i).filter(a=>typeof i[i[a]]!="number"),s={};for(let a of o)s[a]=i[a];return t.objectValues(s)},t.objectValues=i=>t.objectKeys(i).map(function(o){return i[o]}),t.objectKeys=typeof Object.keys=="function"?i=>Object.keys(i):i=>{let o=[];for(let s in i)Object.prototype.hasOwnProperty.call(i,s)&&o.push(s);return o},t.find=(i,o)=>{for(let s of i)if(o(s))return s},t.isInteger=typeof Number.isInteger=="function"?i=>Number.isInteger(i):i=>typeof i=="number"&&Number.isFinite(i)&&Math.floor(i)===i;function r(i,o=" | "){return i.map(s=>typeof s=="string"?`'${s}'`:s).join(o)}t.joinValues=r,t.jsonStringifyReplacer=(i,o)=>typeof o=="bigint"?o.toString():o})(te||(te={}));var Ni;(function(t){t.mergeShapes=(e,n)=>({...e,...n})})(Ni||(Ni={}));var L=te.arrayToEnum(["string","nan","number","integer","float","boolean","date","bigint","symbol","function","undefined","null","array","object","unknown","promise","void","never","map","set"]),jt=t=>{switch(typeof t){case"undefined":return L.undefined;case"string":return L.string;case"number":return Number.isNaN(t)?L.nan:L.number;case"boolean":return L.boolean;case"function":return L.function;case"bigint":return L.bigint;case"symbol":return L.symbol;case"object":return Array.isArray(t)?L.array:t===null?L.null:t.then&&typeof t.then=="function"&&t.catch&&typeof t.catch=="function"?L.promise:typeof Map<"u"&&t instanceof Map?L.map:typeof Set<"u"&&t instanceof Set?L.set:typeof Date<"u"&&t instanceof Date?L.date:L.object;default:return L.unknown}};var S=te.arrayToEnum(["invalid_type","invalid_literal","custom","invalid_union","invalid_union_discriminator","invalid_enum_value","unrecognized_keys","invalid_arguments","invalid_return_type","invalid_date","invalid_string","too_small","too_big","invalid_intersection_types","not_multiple_of","not_finite"]),Mu=t=>JSON.stringify(t,null,2).replace(/"([^"]+)":/g,"$1:"),ct=class t extends Error{get errors(){return this.issues}constructor(e){super(),this.issues=[],this.addIssue=r=>{this.issues=[...this.issues,r]},this.addIssues=(r=[])=>{this.issues=[...this.issues,...r]};let n=new.target.prototype;Object.setPrototypeOf?Object.setPrototypeOf(this,n):this.__proto__=n,this.name="ZodError",this.issues=e}format(e){let n=e||function(o){return o.message},r={_errors:[]},i=o=>{for(let s of o.issues)if(s.code==="invalid_union")s.unionErrors.map(i);else if(s.code==="invalid_return_type")i(s.returnTypeError);else if(s.code==="invalid_arguments")i(s.argumentsError);else if(s.path.length===0)r._errors.push(n(s));else{let a=r,p=0;for(;p<s.path.length;){let c=s.path[p];p===s.path.length-1?(a[c]=a[c]||{_errors:[]},a[c]._errors.push(n(s))):a[c]=a[c]||{_errors:[]},a=a[c],p++}}};return i(this),r}static assert(e){if(!(e instanceof t))throw new Error(`Not a ZodError: ${e}`)}toString(){return this.message}get message(){return JSON.stringify(this.issues,te.jsonStringifyReplacer,2)}get isEmpty(){return this.issues.length===0}flatten(e=n=>n.message){let n={},r=[];for(let i of this.issues)if(i.path.length>0){let o=i.path[0];n[o]=n[o]||[],n[o].push(e(i))}else r.push(e(i));return{formErrors:r,fieldErrors:n}}get formErrors(){return this.flatten()}};ct.create=t=>new ct(t);var Bu=(t,e)=>{let n;switch(t.code){case S.invalid_type:t.received===L.undefined?n="Required":n=`Expected ${t.expected}, received ${t.received}`;break;case S.invalid_literal:n=`Invalid literal value, expected ${JSON.stringify(t.expected,te.jsonStringifyReplacer)}`;break;case S.unrecognized_keys:n=`Unrecognized key(s) in object: ${te.joinValues(t.keys,", ")}`;break;case S.invalid_union:n="Invalid input";break;case S.invalid_union_discriminator:n=`Invalid discriminator value. Expected ${te.joinValues(t.options)}`;break;case S.invalid_enum_value:n=`Invalid enum value. Expected ${te.joinValues(t.options)}, received '${t.received}'`;break;case S.invalid_arguments:n="Invalid function arguments";break;case S.invalid_return_type:n="Invalid function return type";break;case S.invalid_date:n="Invalid date";break;case S.invalid_string:typeof t.validation=="object"?"includes"in t.validation?(n=`Invalid input: must include "${t.validation.includes}"`,typeof t.validation.position=="number"&&(n=`${n} at one or more positions greater than or equal to ${t.validation.position}`)):"startsWith"in t.validation?n=`Invalid input: must start with "${t.validation.startsWith}"`:"endsWith"in t.validation?n=`Invalid input: must end with "${t.validation.endsWith}"`:te.assertNever(t.validation):t.validation!=="regex"?n=`Invalid ${t.validation}`:n="Invalid";break;case S.too_small:t.type==="array"?n=`Array must contain ${t.exact?"exactly":t.inclusive?"at least":"more than"} ${t.minimum} element(s)`:t.type==="string"?n=`String must contain ${t.exact?"exactly":t.inclusive?"at least":"over"} ${t.minimum} character(s)`:t.type==="number"?n=`Number must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${t.minimum}`:t.type==="bigint"?n=`Number must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${t.minimum}`:t.type==="date"?n=`Date must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(t.minimum))}`:n="Invalid input";break;case S.too_big:t.type==="array"?n=`Array must contain ${t.exact?"exactly":t.inclusive?"at most":"less than"} ${t.maximum} element(s)`:t.type==="string"?n=`String must contain ${t.exact?"exactly":t.inclusive?"at most":"under"} ${t.maximum} character(s)`:t.type==="number"?n=`Number must be ${t.exact?"exactly":t.inclusive?"less than or equal to":"less than"} ${t.maximum}`:t.type==="bigint"?n=`BigInt must be ${t.exact?"exactly":t.inclusive?"less than or equal to":"less than"} ${t.maximum}`:t.type==="date"?n=`Date must be ${t.exact?"exactly":t.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(t.maximum))}`:n="Invalid input";break;case S.custom:n="Invalid input";break;case S.invalid_intersection_types:n="Intersection results could not be merged";break;case S.not_multiple_of:n=`Number must be a multiple of ${t.multipleOf}`;break;case S.not_finite:n="Number must be finite";break;default:n=e.defaultError,te.assertNever(t)}return{message:n}},an=Bu;var ys=an;function Lu(t){ys=t}function Er(){return ys}var ao=t=>{let{data:e,path:n,errorMaps:r,issueData:i}=t,o=[...n,...i.path||[]],s={...i,path:o};if(i.message!==void 0)return{...i,path:o,message:i.message};let a="",p=r.filter(c=>!!c).slice().reverse();for(let c of p)a=c(s,{data:e,defaultError:a}).message;return{...i,path:o,message:a}},Iu=[];function M(t,e){let n=Er(),r=ao({issueData:e,data:t.data,path:t.path,errorMaps:[t.common.contextualErrorMap,t.schemaErrorMap,n,n===an?void 0:an].filter(i=>!!i)});t.common.issues.push(r)}var Ve=class t{constructor(){this.value="valid"}dirty(){this.value==="valid"&&(this.value="dirty")}abort(){this.value!=="aborted"&&(this.value="aborted")}static mergeArray(e,n){let r=[];for(let i of n){if(i.status==="aborted")return H;i.status==="dirty"&&e.dirty(),r.push(i.value)}return{status:e.value,value:r}}static async mergeObjectAsync(e,n){let r=[];for(let i of n){let o=await i.key,s=await i.value;r.push({key:o,value:s})}return t.mergeObjectSync(e,r)}static mergeObjectSync(e,n){let r={};for(let i of n){let{key:o,value:s}=i;if(o.status==="aborted"||s.status==="aborted")return H;o.status==="dirty"&&e.dirty(),s.status==="dirty"&&e.dirty(),o.value!=="__proto__"&&(typeof s.value<"u"||i.alwaysSet)&&(r[o.value]=s.value)}return{status:e.value,value:r}}},H=Object.freeze({status:"aborted"}),Fn=t=>({status:"dirty",value:t}),qe=t=>({status:"valid",value:t}),Qo=t=>t.status==="aborted",ei=t=>t.status==="dirty",Mn=t=>t.status==="valid",_r=t=>typeof Promise<"u"&&t instanceof Promise;var D;(function(t){t.errToObj=e=>typeof e=="string"?{message:e}:e||{},t.toString=e=>typeof e=="string"?e:e?.message})(D||(D={}));var bt=class{constructor(e,n,r,i){this._cachedPath=[],this.parent=e,this.data=n,this._path=r,this._key=i}get path(){return this._cachedPath.length||(Array.isArray(this._key)?this._cachedPath.push(...this._path,...this._key):this._cachedPath.push(...this._path,this._key)),this._cachedPath}},bs=(t,e)=>{if(Mn(e))return{success:!0,data:e.value};if(!t.common.issues.length)throw new Error("Validation failed but no issues detected.");return{success:!1,get error(){if(this._error)return this._error;let n=new ct(t.common.issues);return this._error=n,this._error}}};function Z(t){if(!t)return{};let{errorMap:e,invalid_type_error:n,required_error:r,description:i}=t;if(e&&(n||r))throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);return e?{errorMap:e,description:i}:{errorMap:(s,a)=>{let{message:p}=t;return s.code==="invalid_enum_value"?{message:p??a.defaultError}:typeof a.data>"u"?{message:p??r??a.defaultError}:s.code!=="invalid_type"?{message:a.defaultError}:{message:p??n??a.defaultError}},description:i}}var J=class{get description(){return this._def.description}_getType(e){return jt(e.data)}_getOrReturnCtx(e,n){return n||{common:e.parent.common,data:e.data,parsedType:jt(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}_processInputParams(e){return{status:new Ve,ctx:{common:e.parent.common,data:e.data,parsedType:jt(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}}_parseSync(e){let n=this._parse(e);if(_r(n))throw new Error("Synchronous parse encountered promise.");return n}_parseAsync(e){let n=this._parse(e);return Promise.resolve(n)}parse(e,n){let r=this.safeParse(e,n);if(r.success)return r.data;throw r.error}safeParse(e,n){let r={common:{issues:[],async:n?.async??!1,contextualErrorMap:n?.errorMap},path:n?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:jt(e)},i=this._parseSync({data:e,path:r.path,parent:r});return bs(r,i)}"~validate"(e){let n={common:{issues:[],async:!!this["~standard"].async},path:[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:jt(e)};if(!this["~standard"].async)try{let r=this._parseSync({data:e,path:[],parent:n});return Mn(r)?{value:r.value}:{issues:n.common.issues}}catch(r){r?.message?.toLowerCase()?.includes("encountered")&&(this["~standard"].async=!0),n.common={issues:[],async:!0}}return this._parseAsync({data:e,path:[],parent:n}).then(r=>Mn(r)?{value:r.value}:{issues:n.common.issues})}async parseAsync(e,n){let r=await this.safeParseAsync(e,n);if(r.success)return r.data;throw r.error}async safeParseAsync(e,n){let r={common:{issues:[],contextualErrorMap:n?.errorMap,async:!0},path:n?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:jt(e)},i=this._parse({data:e,path:r.path,parent:r}),o=await(_r(i)?i:Promise.resolve(i));return bs(r,o)}refine(e,n){let r=i=>typeof n=="string"||typeof n>"u"?{message:n}:typeof n=="function"?n(i):n;return this._refinement((i,o)=>{let s=e(i),a=()=>o.addIssue({code:S.custom,...r(i)});return typeof Promise<"u"&&s instanceof Promise?s.then(p=>p?!0:(a(),!1)):s?!0:(a(),!1)})}refinement(e,n){return this._refinement((r,i)=>e(r)?!0:(i.addIssue(typeof n=="function"?n(r,i):n),!1))}_refinement(e){return new kt({schema:this,typeName:F.ZodEffects,effect:{type:"refinement",refinement:e}})}superRefine(e){return this._refinement(e)}constructor(e){this.spa=this.safeParseAsync,this._def=e,this.parse=this.parse.bind(this),this.safeParse=this.safeParse.bind(this),this.parseAsync=this.parseAsync.bind(this),this.safeParseAsync=this.safeParseAsync.bind(this),this.spa=this.spa.bind(this),this.refine=this.refine.bind(this),this.refinement=this.refinement.bind(this),this.superRefine=this.superRefine.bind(this),this.optional=this.optional.bind(this),this.nullable=this.nullable.bind(this),this.nullish=this.nullish.bind(this),this.array=this.array.bind(this),this.promise=this.promise.bind(this),this.or=this.or.bind(this),this.and=this.and.bind(this),this.transform=this.transform.bind(this),this.brand=this.brand.bind(this),this.default=this.default.bind(this),this.catch=this.catch.bind(this),this.describe=this.describe.bind(this),this.pipe=this.pipe.bind(this),this.readonly=this.readonly.bind(this),this.isNullable=this.isNullable.bind(this),this.isOptional=this.isOptional.bind(this),this["~standard"]={version:1,vendor:"zod",validate:n=>this["~validate"](n)}}optional(){return yt.create(this,this._def)}nullable(){return Gt.create(this,this._def)}nullish(){return this.nullable().optional()}array(){return cn.create(this)}promise(){return In.create(this,this._def)}or(e){return Wn.create([this,e],this._def)}and(e){return Kn.create(this,e,this._def)}transform(e){return new kt({...Z(this._def),schema:this,typeName:F.ZodEffects,effect:{type:"transform",transform:e}})}default(e){let n=typeof e=="function"?e:()=>e;return new er({...Z(this._def),innerType:this,defaultValue:n,typeName:F.ZodDefault})}brand(){return new so({typeName:F.ZodBranded,type:this,...Z(this._def)})}catch(e){let n=typeof e=="function"?e:()=>e;return new tr({...Z(this._def),innerType:this,catchValue:n,typeName:F.ZodCatch})}describe(e){let n=this.constructor;return new n({...this._def,description:e})}pipe(e){return lo.create(this,e)}readonly(){return nr.create(this)}isOptional(){return this.safeParse(void 0).success}isNullable(){return this.safeParse(null).success}},Cu=/^c[^\s-]{8,}$/i,Du=/^[0-9a-z]+$/,Ru=/^[0-9A-HJKMNP-TV-Z]{26}$/i,Pu=/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,Ou=/^[a-z0-9_-]{21}$/i,Nu=/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,zu=/^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,Hu=/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,$u="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",zi,Fu=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,ju=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,Vu=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,Gu=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Uu=/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,qu=/^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,ws="((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",Zu=new RegExp(`^${ws}$`);function xs(t){let e="[0-5]\\d";t.precision?e=`${e}\\.\\d{${t.precision}}`:t.precision==null&&(e=`${e}(\\.\\d+)?`);let n=t.precision?"+":"?";return`([01]\\d|2[0-3]):[0-5]\\d(:${e})${n}`}function Wu(t){return new RegExp(`^${xs(t)}$`)}function Ts(t){let e=`${ws}T${xs(t)}`,n=[];return n.push(t.local?"Z?":"Z"),t.offset&&n.push("([+-]\\d{2}:?\\d{2})"),e=`${e}(${n.join("|")})`,new RegExp(`^${e}$`)}function Ku(t,e){return!!((e==="v4"||!e)&&Fu.test(t)||(e==="v6"||!e)&&Vu.test(t))}function Yu(t,e){if(!Nu.test(t))return!1;try{let[n]=t.split(".");if(!n)return!1;let r=n.replace(/-/g,"+").replace(/_/g,"/").padEnd(n.length+(4-n.length%4)%4,"="),i=JSON.parse(atob(r));return!(typeof i!="object"||i===null||"typ"in i&&i?.typ!=="JWT"||!i.alg||e&&i.alg!==e)}catch{return!1}}function Ju(t,e){return!!((e==="v4"||!e)&&ju.test(t)||(e==="v6"||!e)&&Gu.test(t))}var Bn=class t extends J{_parse(e){if(this._def.coerce&&(e.data=String(e.data)),this._getType(e)!==L.string){let o=this._getOrReturnCtx(e);return M(o,{code:S.invalid_type,expected:L.string,received:o.parsedType}),H}let r=new Ve,i;for(let o of this._def.checks)if(o.kind==="min")e.data.length<o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:S.too_small,minimum:o.value,type:"string",inclusive:!0,exact:!1,message:o.message}),r.dirty());else if(o.kind==="max")e.data.length>o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:S.too_big,maximum:o.value,type:"string",inclusive:!0,exact:!1,message:o.message}),r.dirty());else if(o.kind==="length"){let s=e.data.length>o.value,a=e.data.length<o.value;(s||a)&&(i=this._getOrReturnCtx(e,i),s?M(i,{code:S.too_big,maximum:o.value,type:"string",inclusive:!0,exact:!0,message:o.message}):a&&M(i,{code:S.too_small,minimum:o.value,type:"string",inclusive:!0,exact:!0,message:o.message}),r.dirty())}else if(o.kind==="email")Hu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"email",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="emoji")zi||(zi=new RegExp($u,"u")),zi.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"emoji",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="uuid")Pu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"uuid",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="nanoid")Ou.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"nanoid",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="cuid")Cu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"cuid",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="cuid2")Du.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"cuid2",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="ulid")Ru.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"ulid",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="url")try{new URL(e.data)}catch{i=this._getOrReturnCtx(e,i),M(i,{validation:"url",code:S.invalid_string,message:o.message}),r.dirty()}else o.kind==="regex"?(o.regex.lastIndex=0,o.regex.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"regex",code:S.invalid_string,message:o.message}),r.dirty())):o.kind==="trim"?e.data=e.data.trim():o.kind==="includes"?e.data.includes(o.value,o.position)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:{includes:o.value,position:o.position},message:o.message}),r.dirty()):o.kind==="toLowerCase"?e.data=e.data.toLowerCase():o.kind==="toUpperCase"?e.data=e.data.toUpperCase():o.kind==="startsWith"?e.data.startsWith(o.value)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:{startsWith:o.value},message:o.message}),r.dirty()):o.kind==="endsWith"?e.data.endsWith(o.value)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:{endsWith:o.value},message:o.message}),r.dirty()):o.kind==="datetime"?Ts(o).test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:"datetime",message:o.message}),r.dirty()):o.kind==="date"?Zu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:"date",message:o.message}),r.dirty()):o.kind==="time"?Wu(o).test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:"time",message:o.message}),r.dirty()):o.kind==="duration"?zu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"duration",code:S.invalid_string,message:o.message}),r.dirty()):o.kind==="ip"?Ku(e.data,o.version)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"ip",code:S.invalid_string,message:o.message}),r.dirty()):o.kind==="jwt"?Yu(e.data,o.alg)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"jwt",code:S.invalid_string,message:o.message}),r.dirty()):o.kind==="cidr"?Ju(e.data,o.version)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"cidr",code:S.invalid_string,message:o.message}),r.dirty()):o.kind==="base64"?Uu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"base64",code:S.invalid_string,message:o.message}),r.dirty()):o.kind==="base64url"?qu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"base64url",code:S.invalid_string,message:o.message}),r.dirty()):te.assertNever(o);return{status:r.value,value:e.data}}_regex(e,n,r){return this.refinement(i=>e.test(i),{validation:n,code:S.invalid_string,...D.errToObj(r)})}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}email(e){return this._addCheck({kind:"email",...D.errToObj(e)})}url(e){return this._addCheck({kind:"url",...D.errToObj(e)})}emoji(e){return this._addCheck({kind:"emoji",...D.errToObj(e)})}uuid(e){return this._addCheck({kind:"uuid",...D.errToObj(e)})}nanoid(e){return this._addCheck({kind:"nanoid",...D.errToObj(e)})}cuid(e){return this._addCheck({kind:"cuid",...D.errToObj(e)})}cuid2(e){return this._addCheck({kind:"cuid2",...D.errToObj(e)})}ulid(e){return this._addCheck({kind:"ulid",...D.errToObj(e)})}base64(e){return this._addCheck({kind:"base64",...D.errToObj(e)})}base64url(e){return this._addCheck({kind:"base64url",...D.errToObj(e)})}jwt(e){return this._addCheck({kind:"jwt",...D.errToObj(e)})}ip(e){return this._addCheck({kind:"ip",...D.errToObj(e)})}cidr(e){return this._addCheck({kind:"cidr",...D.errToObj(e)})}datetime(e){return typeof e=="string"?this._addCheck({kind:"datetime",precision:null,offset:!1,local:!1,message:e}):this._addCheck({kind:"datetime",precision:typeof e?.precision>"u"?null:e?.precision,offset:e?.offset??!1,local:e?.local??!1,...D.errToObj(e?.message)})}date(e){return this._addCheck({kind:"date",message:e})}time(e){return typeof e=="string"?this._addCheck({kind:"time",precision:null,message:e}):this._addCheck({kind:"time",precision:typeof e?.precision>"u"?null:e?.precision,...D.errToObj(e?.message)})}duration(e){return this._addCheck({kind:"duration",...D.errToObj(e)})}regex(e,n){return this._addCheck({kind:"regex",regex:e,...D.errToObj(n)})}includes(e,n){return this._addCheck({kind:"includes",value:e,position:n?.position,...D.errToObj(n?.message)})}startsWith(e,n){return this._addCheck({kind:"startsWith",value:e,...D.errToObj(n)})}endsWith(e,n){return this._addCheck({kind:"endsWith",value:e,...D.errToObj(n)})}min(e,n){return this._addCheck({kind:"min",value:e,...D.errToObj(n)})}max(e,n){return this._addCheck({kind:"max",value:e,...D.errToObj(n)})}length(e,n){return this._addCheck({kind:"length",value:e,...D.errToObj(n)})}nonempty(e){return this.min(1,D.errToObj(e))}trim(){return new t({...this._def,checks:[...this._def.checks,{kind:"trim"}]})}toLowerCase(){return new t({...this._def,checks:[...this._def.checks,{kind:"toLowerCase"}]})}toUpperCase(){return new t({...this._def,checks:[...this._def.checks,{kind:"toUpperCase"}]})}get isDatetime(){return!!this._def.checks.find(e=>e.kind==="datetime")}get isDate(){return!!this._def.checks.find(e=>e.kind==="date")}get isTime(){return!!this._def.checks.find(e=>e.kind==="time")}get isDuration(){return!!this._def.checks.find(e=>e.kind==="duration")}get isEmail(){return!!this._def.checks.find(e=>e.kind==="email")}get isURL(){return!!this._def.checks.find(e=>e.kind==="url")}get isEmoji(){return!!this._def.checks.find(e=>e.kind==="emoji")}get isUUID(){return!!this._def.checks.find(e=>e.kind==="uuid")}get isNANOID(){return!!this._def.checks.find(e=>e.kind==="nanoid")}get isCUID(){return!!this._def.checks.find(e=>e.kind==="cuid")}get isCUID2(){return!!this._def.checks.find(e=>e.kind==="cuid2")}get isULID(){return!!this._def.checks.find(e=>e.kind==="ulid")}get isIP(){return!!this._def.checks.find(e=>e.kind==="ip")}get isCIDR(){return!!this._def.checks.find(e=>e.kind==="cidr")}get isBase64(){return!!this._def.checks.find(e=>e.kind==="base64")}get isBase64url(){return!!this._def.checks.find(e=>e.kind==="base64url")}get minLength(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxLength(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}};Bn.create=t=>new Bn({checks:[],typeName:F.ZodString,coerce:t?.coerce??!1,...Z(t)});function Xu(t,e){let n=(t.toString().split(".")[1]||"").length,r=(e.toString().split(".")[1]||"").length,i=n>r?n:r,o=Number.parseInt(t.toFixed(i).replace(".","")),s=Number.parseInt(e.toFixed(i).replace(".",""));return o%s/10**i}var jn=class t extends J{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte,this.step=this.multipleOf}_parse(e){if(this._def.coerce&&(e.data=Number(e.data)),this._getType(e)!==L.number){let o=this._getOrReturnCtx(e);return M(o,{code:S.invalid_type,expected:L.number,received:o.parsedType}),H}let r,i=new Ve;for(let o of this._def.checks)o.kind==="int"?te.isInteger(e.data)||(r=this._getOrReturnCtx(e,r),M(r,{code:S.invalid_type,expected:"integer",received:"float",message:o.message}),i.dirty()):o.kind==="min"?(o.inclusive?e.data<o.value:e.data<=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.too_small,minimum:o.value,type:"number",inclusive:o.inclusive,exact:!1,message:o.message}),i.dirty()):o.kind==="max"?(o.inclusive?e.data>o.value:e.data>=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.too_big,maximum:o.value,type:"number",inclusive:o.inclusive,exact:!1,message:o.message}),i.dirty()):o.kind==="multipleOf"?Xu(e.data,o.value)!==0&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.not_multiple_of,multipleOf:o.value,message:o.message}),i.dirty()):o.kind==="finite"?Number.isFinite(e.data)||(r=this._getOrReturnCtx(e,r),M(r,{code:S.not_finite,message:o.message}),i.dirty()):te.assertNever(o);return{status:i.value,value:e.data}}gte(e,n){return this.setLimit("min",e,!0,D.toString(n))}gt(e,n){return this.setLimit("min",e,!1,D.toString(n))}lte(e,n){return this.setLimit("max",e,!0,D.toString(n))}lt(e,n){return this.setLimit("max",e,!1,D.toString(n))}setLimit(e,n,r,i){return new t({...this._def,checks:[...this._def.checks,{kind:e,value:n,inclusive:r,message:D.toString(i)}]})}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}int(e){return this._addCheck({kind:"int",message:D.toString(e)})}positive(e){return this._addCheck({kind:"min",value:0,inclusive:!1,message:D.toString(e)})}negative(e){return this._addCheck({kind:"max",value:0,inclusive:!1,message:D.toString(e)})}nonpositive(e){return this._addCheck({kind:"max",value:0,inclusive:!0,message:D.toString(e)})}nonnegative(e){return this._addCheck({kind:"min",value:0,inclusive:!0,message:D.toString(e)})}multipleOf(e,n){return this._addCheck({kind:"multipleOf",value:e,message:D.toString(n)})}finite(e){return this._addCheck({kind:"finite",message:D.toString(e)})}safe(e){return this._addCheck({kind:"min",inclusive:!0,value:Number.MIN_SAFE_INTEGER,message:D.toString(e)})._addCheck({kind:"max",inclusive:!0,value:Number.MAX_SAFE_INTEGER,message:D.toString(e)})}get minValue(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxValue(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}get isInt(){return!!this._def.checks.find(e=>e.kind==="int"||e.kind==="multipleOf"&&te.isInteger(e.value))}get isFinite(){let e=null,n=null;for(let r of this._def.checks){if(r.kind==="finite"||r.kind==="int"||r.kind==="multipleOf")return!0;r.kind==="min"?(n===null||r.value>n)&&(n=r.value):r.kind==="max"&&(e===null||r.value<e)&&(e=r.value)}return Number.isFinite(n)&&Number.isFinite(e)}};jn.create=t=>new jn({checks:[],typeName:F.ZodNumber,coerce:t?.coerce||!1,...Z(t)});var Vn=class t extends J{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte}_parse(e){if(this._def.coerce)try{e.data=BigInt(e.data)}catch{return this._getInvalidInput(e)}if(this._getType(e)!==L.bigint)return this._getInvalidInput(e);let r,i=new Ve;for(let o of this._def.checks)o.kind==="min"?(o.inclusive?e.data<o.value:e.data<=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.too_small,type:"bigint",minimum:o.value,inclusive:o.inclusive,message:o.message}),i.dirty()):o.kind==="max"?(o.inclusive?e.data>o.value:e.data>=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.too_big,type:"bigint",maximum:o.value,inclusive:o.inclusive,message:o.message}),i.dirty()):o.kind==="multipleOf"?e.data%o.value!==BigInt(0)&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.not_multiple_of,multipleOf:o.value,message:o.message}),i.dirty()):te.assertNever(o);return{status:i.value,value:e.data}}_getInvalidInput(e){let n=this._getOrReturnCtx(e);return M(n,{code:S.invalid_type,expected:L.bigint,received:n.parsedType}),H}gte(e,n){return this.setLimit("min",e,!0,D.toString(n))}gt(e,n){return this.setLimit("min",e,!1,D.toString(n))}lte(e,n){return this.setLimit("max",e,!0,D.toString(n))}lt(e,n){return this.setLimit("max",e,!1,D.toString(n))}setLimit(e,n,r,i){return new t({...this._def,checks:[...this._def.checks,{kind:e,value:n,inclusive:r,message:D.toString(i)}]})}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}positive(e){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!1,message:D.toString(e)})}negative(e){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!1,message:D.toString(e)})}nonpositive(e){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!0,message:D.toString(e)})}nonnegative(e){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!0,message:D.toString(e)})}multipleOf(e,n){return this._addCheck({kind:"multipleOf",value:e,message:D.toString(n)})}get minValue(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxValue(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}};Vn.create=t=>new Vn({checks:[],typeName:F.ZodBigInt,coerce:t?.coerce??!1,...Z(t)});var Gn=class extends J{_parse(e){if(this._def.coerce&&(e.data=!!e.data),this._getType(e)!==L.boolean){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:L.boolean,received:r.parsedType}),H}return qe(e.data)}};Gn.create=t=>new Gn({typeName:F.ZodBoolean,coerce:t?.coerce||!1,...Z(t)});var Un=class t extends J{_parse(e){if(this._def.coerce&&(e.data=new Date(e.data)),this._getType(e)!==L.date){let o=this._getOrReturnCtx(e);return M(o,{code:S.invalid_type,expected:L.date,received:o.parsedType}),H}if(Number.isNaN(e.data.getTime())){let o=this._getOrReturnCtx(e);return M(o,{code:S.invalid_date}),H}let r=new Ve,i;for(let o of this._def.checks)o.kind==="min"?e.data.getTime()<o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:S.too_small,message:o.message,inclusive:!0,exact:!1,minimum:o.value,type:"date"}),r.dirty()):o.kind==="max"?e.data.getTime()>o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:S.too_big,message:o.message,inclusive:!0,exact:!1,maximum:o.value,type:"date"}),r.dirty()):te.assertNever(o);return{status:r.value,value:new Date(e.data.getTime())}}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}min(e,n){return this._addCheck({kind:"min",value:e.getTime(),message:D.toString(n)})}max(e,n){return this._addCheck({kind:"max",value:e.getTime(),message:D.toString(n)})}get minDate(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e!=null?new Date(e):null}get maxDate(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e!=null?new Date(e):null}};Un.create=t=>new Un({checks:[],coerce:t?.coerce||!1,typeName:F.ZodDate,...Z(t)});var Mr=class extends J{_parse(e){if(this._getType(e)!==L.symbol){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:L.symbol,received:r.parsedType}),H}return qe(e.data)}};Mr.create=t=>new Mr({typeName:F.ZodSymbol,...Z(t)});var qn=class extends J{_parse(e){if(this._getType(e)!==L.undefined){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:L.undefined,received:r.parsedType}),H}return qe(e.data)}};qn.create=t=>new qn({typeName:F.ZodUndefined,...Z(t)});var Zn=class extends J{_parse(e){if(this._getType(e)!==L.null){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:L.null,received:r.parsedType}),H}return qe(e.data)}};Zn.create=t=>new Zn({typeName:F.ZodNull,...Z(t)});var Ln=class extends J{constructor(){super(...arguments),this._any=!0}_parse(e){return qe(e.data)}};Ln.create=t=>new Ln({typeName:F.ZodAny,...Z(t)});var ln=class extends J{constructor(){super(...arguments),this._unknown=!0}_parse(e){return qe(e.data)}};ln.create=t=>new ln({typeName:F.ZodUnknown,...Z(t)});var Dt=class extends J{_parse(e){let n=this._getOrReturnCtx(e);return M(n,{code:S.invalid_type,expected:L.never,received:n.parsedType}),H}};Dt.create=t=>new Dt({typeName:F.ZodNever,...Z(t)});var Br=class extends J{_parse(e){if(this._getType(e)!==L.undefined){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:L.void,received:r.parsedType}),H}return qe(e.data)}};Br.create=t=>new Br({typeName:F.ZodVoid,...Z(t)});var cn=class t extends J{_parse(e){let{ctx:n,status:r}=this._processInputParams(e),i=this._def;if(n.parsedType!==L.array)return M(n,{code:S.invalid_type,expected:L.array,received:n.parsedType}),H;if(i.exactLength!==null){let s=n.data.length>i.exactLength.value,a=n.data.length<i.exactLength.value;(s||a)&&(M(n,{code:s?S.too_big:S.too_small,minimum:a?i.exactLength.value:void 0,maximum:s?i.exactLength.value:void 0,type:"array",inclusive:!0,exact:!0,message:i.exactLength.message}),r.dirty())}if(i.minLength!==null&&n.data.length<i.minLength.value&&(M(n,{code:S.too_small,minimum:i.minLength.value,type:"array",inclusive:!0,exact:!1,message:i.minLength.message}),r.dirty()),i.maxLength!==null&&n.data.length>i.maxLength.value&&(M(n,{code:S.too_big,maximum:i.maxLength.value,type:"array",inclusive:!0,exact:!1,message:i.maxLength.message}),r.dirty()),n.common.async)return Promise.all([...n.data].map((s,a)=>i.type._parseAsync(new bt(n,s,n.path,a)))).then(s=>Ve.mergeArray(r,s));let o=[...n.data].map((s,a)=>i.type._parseSync(new bt(n,s,n.path,a)));return Ve.mergeArray(r,o)}get element(){return this._def.type}min(e,n){return new t({...this._def,minLength:{value:e,message:D.toString(n)}})}max(e,n){return new t({...this._def,maxLength:{value:e,message:D.toString(n)}})}length(e,n){return new t({...this._def,exactLength:{value:e,message:D.toString(n)}})}nonempty(e){return this.min(1,e)}};cn.create=(t,e)=>new cn({type:t,minLength:null,maxLength:null,exactLength:null,typeName:F.ZodArray,...Z(e)});function Ar(t){if(t instanceof ut){let e={};for(let n in t.shape){let r=t.shape[n];e[n]=yt.create(Ar(r))}return new ut({...t._def,shape:()=>e})}else return t instanceof cn?new cn({...t._def,type:Ar(t.element)}):t instanceof yt?yt.create(Ar(t.unwrap())):t instanceof Gt?Gt.create(Ar(t.unwrap())):t instanceof Vt?Vt.create(t.items.map(e=>Ar(e))):t}var ut=class t extends J{constructor(){super(...arguments),this._cached=null,this.nonstrict=this.passthrough,this.augment=this.extend}_getCached(){if(this._cached!==null)return this._cached;let e=this._def.shape(),n=te.objectKeys(e);return this._cached={shape:e,keys:n},this._cached}_parse(e){if(this._getType(e)!==L.object){let c=this._getOrReturnCtx(e);return M(c,{code:S.invalid_type,expected:L.object,received:c.parsedType}),H}let{status:r,ctx:i}=this._processInputParams(e),{shape:o,keys:s}=this._getCached(),a=[];if(!(this._def.catchall instanceof Dt&&this._def.unknownKeys==="strip"))for(let c in i.data)s.includes(c)||a.push(c);let p=[];for(let c of s){let u=o[c],g=i.data[c];p.push({key:{status:"valid",value:c},value:u._parse(new bt(i,g,i.path,c)),alwaysSet:c in i.data})}if(this._def.catchall instanceof Dt){let c=this._def.unknownKeys;if(c==="passthrough")for(let u of a)p.push({key:{status:"valid",value:u},value:{status:"valid",value:i.data[u]}});else if(c==="strict")a.length>0&&(M(i,{code:S.unrecognized_keys,keys:a}),r.dirty());else if(c!=="strip")throw new Error("Internal ZodObject error: invalid unknownKeys value.")}else{let c=this._def.catchall;for(let u of a){let g=i.data[u];p.push({key:{status:"valid",value:u},value:c._parse(new bt(i,g,i.path,u)),alwaysSet:u in i.data})}}return i.common.async?Promise.resolve().then(async()=>{let c=[];for(let u of p){let g=await u.key,y=await u.value;c.push({key:g,value:y,alwaysSet:u.alwaysSet})}return c}).then(c=>Ve.mergeObjectSync(r,c)):Ve.mergeObjectSync(r,p)}get shape(){return this._def.shape()}strict(e){return D.errToObj,new t({...this._def,unknownKeys:"strict",...e!==void 0?{errorMap:(n,r)=>{let i=this._def.errorMap?.(n,r).message??r.defaultError;return n.code==="unrecognized_keys"?{message:D.errToObj(e).message??i}:{message:i}}}:{}})}strip(){return new t({...this._def,unknownKeys:"strip"})}passthrough(){return new t({...this._def,unknownKeys:"passthrough"})}extend(e){return new t({...this._def,shape:()=>({...this._def.shape(),...e})})}merge(e){return new t({unknownKeys:e._def.unknownKeys,catchall:e._def.catchall,shape:()=>({...this._def.shape(),...e._def.shape()}),typeName:F.ZodObject})}setKey(e,n){return this.augment({[e]:n})}catchall(e){return new t({...this._def,catchall:e})}pick(e){let n={};for(let r of te.objectKeys(e))e[r]&&this.shape[r]&&(n[r]=this.shape[r]);return new t({...this._def,shape:()=>n})}omit(e){let n={};for(let r of te.objectKeys(this.shape))e[r]||(n[r]=this.shape[r]);return new t({...this._def,shape:()=>n})}deepPartial(){return Ar(this)}partial(e){let n={};for(let r of te.objectKeys(this.shape)){let i=this.shape[r];e&&!e[r]?n[r]=i:n[r]=i.optional()}return new t({...this._def,shape:()=>n})}required(e){let n={};for(let r of te.objectKeys(this.shape))if(e&&!e[r])n[r]=this.shape[r];else{let o=this.shape[r];for(;o instanceof yt;)o=o._def.innerType;n[r]=o}return new t({...this._def,shape:()=>n})}keyof(){return Ss(te.objectKeys(this.shape))}};ut.create=(t,e)=>new ut({shape:()=>t,unknownKeys:"strip",catchall:Dt.create(),typeName:F.ZodObject,...Z(e)});ut.strictCreate=(t,e)=>new ut({shape:()=>t,unknownKeys:"strict",catchall:Dt.create(),typeName:F.ZodObject,...Z(e)});ut.lazycreate=(t,e)=>new ut({shape:t,unknownKeys:"strip",catchall:Dt.create(),typeName:F.ZodObject,...Z(e)});var Wn=class extends J{_parse(e){let{ctx:n}=this._processInputParams(e),r=this._def.options;function i(o){for(let a of o)if(a.result.status==="valid")return a.result;for(let a of o)if(a.result.status==="dirty")return n.common.issues.push(...a.ctx.common.issues),a.result;let s=o.map(a=>new ct(a.ctx.common.issues));return M(n,{code:S.invalid_union,unionErrors:s}),H}if(n.common.async)return Promise.all(r.map(async o=>{let s={...n,common:{...n.common,issues:[]},parent:null};return{result:await o._parseAsync({data:n.data,path:n.path,parent:s}),ctx:s}})).then(i);{let o,s=[];for(let p of r){let c={...n,common:{...n.common,issues:[]},parent:null},u=p._parseSync({data:n.data,path:n.path,parent:c});if(u.status==="valid")return u;u.status==="dirty"&&!o&&(o={result:u,ctx:c}),c.common.issues.length&&s.push(c.common.issues)}if(o)return n.common.issues.push(...o.ctx.common.issues),o.result;let a=s.map(p=>new ct(p));return M(n,{code:S.invalid_union,unionErrors:a}),H}}get options(){return this._def.options}};Wn.create=(t,e)=>new Wn({options:t,typeName:F.ZodUnion,...Z(e)});var sn=t=>t instanceof Yn?sn(t.schema):t instanceof kt?sn(t.innerType()):t instanceof Jn?[t.value]:t instanceof Xn?t.options:t instanceof Qn?te.objectValues(t.enum):t instanceof er?sn(t._def.innerType):t instanceof qn?[void 0]:t instanceof Zn?[null]:t instanceof yt?[void 0,...sn(t.unwrap())]:t instanceof Gt?[null,...sn(t.unwrap())]:t instanceof so||t instanceof nr?sn(t.unwrap()):t instanceof tr?sn(t._def.innerType):[],ti=class t extends J{_parse(e){let{ctx:n}=this._processInputParams(e);if(n.parsedType!==L.object)return M(n,{code:S.invalid_type,expected:L.object,received:n.parsedType}),H;let r=this.discriminator,i=n.data[r],o=this.optionsMap.get(i);return o?n.common.async?o._parseAsync({data:n.data,path:n.path,parent:n}):o._parseSync({data:n.data,path:n.path,parent:n}):(M(n,{code:S.invalid_union_discriminator,options:Array.from(this.optionsMap.keys()),path:[r]}),H)}get discriminator(){return this._def.discriminator}get options(){return this._def.options}get optionsMap(){return this._def.optionsMap}static create(e,n,r){let i=new Map;for(let o of n){let s=sn(o.shape[e]);if(!s.length)throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);for(let a of s){if(i.has(a))throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(a)}`);i.set(a,o)}}return new t({typeName:F.ZodDiscriminatedUnion,discriminator:e,options:n,optionsMap:i,...Z(r)})}};function Hi(t,e){let n=jt(t),r=jt(e);if(t===e)return{valid:!0,data:t};if(n===L.object&&r===L.object){let i=te.objectKeys(e),o=te.objectKeys(t).filter(a=>i.indexOf(a)!==-1),s={...t,...e};for(let a of o){let p=Hi(t[a],e[a]);if(!p.valid)return{valid:!1};s[a]=p.data}return{valid:!0,data:s}}else if(n===L.array&&r===L.array){if(t.length!==e.length)return{valid:!1};let i=[];for(let o=0;o<t.length;o++){let s=t[o],a=e[o],p=Hi(s,a);if(!p.valid)return{valid:!1};i.push(p.data)}return{valid:!0,data:i}}else return n===L.date&&r===L.date&&+t==+e?{valid:!0,data:t}:{valid:!1}}var Kn=class extends J{_parse(e){let{status:n,ctx:r}=this._processInputParams(e),i=(o,s)=>{if(Qo(o)||Qo(s))return H;let a=Hi(o.value,s.value);return a.valid?((ei(o)||ei(s))&&n.dirty(),{status:n.value,value:a.data}):(M(r,{code:S.invalid_intersection_types}),H)};return r.common.async?Promise.all([this._def.left._parseAsync({data:r.data,path:r.path,parent:r}),this._def.right._parseAsync({data:r.data,path:r.path,parent:r})]).then(([o,s])=>i(o,s)):i(this._def.left._parseSync({data:r.data,path:r.path,parent:r}),this._def.right._parseSync({data:r.data,path:r.path,parent:r}))}};Kn.create=(t,e,n)=>new Kn({left:t,right:e,typeName:F.ZodIntersection,...Z(n)});var Vt=class t extends J{_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==L.array)return M(r,{code:S.invalid_type,expected:L.array,received:r.parsedType}),H;if(r.data.length<this._def.items.length)return M(r,{code:S.too_small,minimum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),H;!this._def.rest&&r.data.length>this._def.items.length&&(M(r,{code:S.too_big,maximum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),n.dirty());let o=[...r.data].map((s,a)=>{let p=this._def.items[a]||this._def.rest;return p?p._parse(new bt(r,s,r.path,a)):null}).filter(s=>!!s);return r.common.async?Promise.all(o).then(s=>Ve.mergeArray(n,s)):Ve.mergeArray(n,o)}get items(){return this._def.items}rest(e){return new t({...this._def,rest:e})}};Vt.create=(t,e)=>{if(!Array.isArray(t))throw new Error("You must pass an array of schemas to z.tuple([ ... ])");return new Vt({items:t,typeName:F.ZodTuple,rest:null,...Z(e)})};var ni=class t extends J{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==L.object)return M(r,{code:S.invalid_type,expected:L.object,received:r.parsedType}),H;let i=[],o=this._def.keyType,s=this._def.valueType;for(let a in r.data)i.push({key:o._parse(new bt(r,a,r.path,a)),value:s._parse(new bt(r,r.data[a],r.path,a)),alwaysSet:a in r.data});return r.common.async?Ve.mergeObjectAsync(n,i):Ve.mergeObjectSync(n,i)}get element(){return this._def.valueType}static create(e,n,r){return n instanceof J?new t({keyType:e,valueType:n,typeName:F.ZodRecord,...Z(r)}):new t({keyType:Bn.create(),valueType:e,typeName:F.ZodRecord,...Z(n)})}},Lr=class extends J{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==L.map)return M(r,{code:S.invalid_type,expected:L.map,received:r.parsedType}),H;let i=this._def.keyType,o=this._def.valueType,s=[...r.data.entries()].map(([a,p],c)=>({key:i._parse(new bt(r,a,r.path,[c,"key"])),value:o._parse(new bt(r,p,r.path,[c,"value"]))}));if(r.common.async){let a=new Map;return Promise.resolve().then(async()=>{for(let p of s){let c=await p.key,u=await p.value;if(c.status==="aborted"||u.status==="aborted")return H;(c.status==="dirty"||u.status==="dirty")&&n.dirty(),a.set(c.value,u.value)}return{status:n.value,value:a}})}else{let a=new Map;for(let p of s){let c=p.key,u=p.value;if(c.status==="aborted"||u.status==="aborted")return H;(c.status==="dirty"||u.status==="dirty")&&n.dirty(),a.set(c.value,u.value)}return{status:n.value,value:a}}}};Lr.create=(t,e,n)=>new Lr({valueType:e,keyType:t,typeName:F.ZodMap,...Z(n)});var Ir=class t extends J{_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==L.set)return M(r,{code:S.invalid_type,expected:L.set,received:r.parsedType}),H;let i=this._def;i.minSize!==null&&r.data.size<i.minSize.value&&(M(r,{code:S.too_small,minimum:i.minSize.value,type:"set",inclusive:!0,exact:!1,message:i.minSize.message}),n.dirty()),i.maxSize!==null&&r.data.size>i.maxSize.value&&(M(r,{code:S.too_big,maximum:i.maxSize.value,type:"set",inclusive:!0,exact:!1,message:i.maxSize.message}),n.dirty());let o=this._def.valueType;function s(p){let c=new Set;for(let u of p){if(u.status==="aborted")return H;u.status==="dirty"&&n.dirty(),c.add(u.value)}return{status:n.value,value:c}}let a=[...r.data.values()].map((p,c)=>o._parse(new bt(r,p,r.path,c)));return r.common.async?Promise.all(a).then(p=>s(p)):s(a)}min(e,n){return new t({...this._def,minSize:{value:e,message:D.toString(n)}})}max(e,n){return new t({...this._def,maxSize:{value:e,message:D.toString(n)}})}size(e,n){return this.min(e,n).max(e,n)}nonempty(e){return this.min(1,e)}};Ir.create=(t,e)=>new Ir({valueType:t,minSize:null,maxSize:null,typeName:F.ZodSet,...Z(e)});var ri=class t extends J{constructor(){super(...arguments),this.validate=this.implement}_parse(e){let{ctx:n}=this._processInputParams(e);if(n.parsedType!==L.function)return M(n,{code:S.invalid_type,expected:L.function,received:n.parsedType}),H;function r(a,p){return ao({data:a,path:n.path,errorMaps:[n.common.contextualErrorMap,n.schemaErrorMap,Er(),an].filter(c=>!!c),issueData:{code:S.invalid_arguments,argumentsError:p}})}function i(a,p){return ao({data:a,path:n.path,errorMaps:[n.common.contextualErrorMap,n.schemaErrorMap,Er(),an].filter(c=>!!c),issueData:{code:S.invalid_return_type,returnTypeError:p}})}let o={errorMap:n.common.contextualErrorMap},s=n.data;if(this._def.returns instanceof In){let a=this;return qe(async function(...p){let c=new ct([]),u=await a._def.args.parseAsync(p,o).catch(_=>{throw c.addIssue(r(p,_)),c}),g=await Reflect.apply(s,this,u);return await a._def.returns._def.type.parseAsync(g,o).catch(_=>{throw c.addIssue(i(g,_)),c})})}else{let a=this;return qe(function(...p){let c=a._def.args.safeParse(p,o);if(!c.success)throw new ct([r(p,c.error)]);let u=Reflect.apply(s,this,c.data),g=a._def.returns.safeParse(u,o);if(!g.success)throw new ct([i(u,g.error)]);return g.data})}}parameters(){return this._def.args}returnType(){return this._def.returns}args(...e){return new t({...this._def,args:Vt.create(e).rest(ln.create())})}returns(e){return new t({...this._def,returns:e})}implement(e){return this.parse(e)}strictImplement(e){return this.parse(e)}static create(e,n,r){return new t({args:e||Vt.create([]).rest(ln.create()),returns:n||ln.create(),typeName:F.ZodFunction,...Z(r)})}},Yn=class extends J{get schema(){return this._def.getter()}_parse(e){let{ctx:n}=this._processInputParams(e);return this._def.getter()._parse({data:n.data,path:n.path,parent:n})}};Yn.create=(t,e)=>new Yn({getter:t,typeName:F.ZodLazy,...Z(e)});var Jn=class extends J{_parse(e){if(e.data!==this._def.value){let n=this._getOrReturnCtx(e);return M(n,{received:n.data,code:S.invalid_literal,expected:this._def.value}),H}return{status:"valid",value:e.data}}get value(){return this._def.value}};Jn.create=(t,e)=>new Jn({value:t,typeName:F.ZodLiteral,...Z(e)});function Ss(t,e){return new Xn({values:t,typeName:F.ZodEnum,...Z(e)})}var Xn=class t extends J{_parse(e){if(typeof e.data!="string"){let n=this._getOrReturnCtx(e),r=this._def.values;return M(n,{expected:te.joinValues(r),received:n.parsedType,code:S.invalid_type}),H}if(this._cache||(this._cache=new Set(this._def.values)),!this._cache.has(e.data)){let n=this._getOrReturnCtx(e),r=this._def.values;return M(n,{received:n.data,code:S.invalid_enum_value,options:r}),H}return qe(e.data)}get options(){return this._def.values}get enum(){let e={};for(let n of this._def.values)e[n]=n;return e}get Values(){let e={};for(let n of this._def.values)e[n]=n;return e}get Enum(){let e={};for(let n of this._def.values)e[n]=n;return e}extract(e,n=this._def){return t.create(e,{...this._def,...n})}exclude(e,n=this._def){return t.create(this.options.filter(r=>!e.includes(r)),{...this._def,...n})}};Xn.create=Ss;var Qn=class extends J{_parse(e){let n=te.getValidEnumValues(this._def.values),r=this._getOrReturnCtx(e);if(r.parsedType!==L.string&&r.parsedType!==L.number){let i=te.objectValues(n);return M(r,{expected:te.joinValues(i),received:r.parsedType,code:S.invalid_type}),H}if(this._cache||(this._cache=new Set(te.getValidEnumValues(this._def.values))),!this._cache.has(e.data)){let i=te.objectValues(n);return M(r,{received:r.data,code:S.invalid_enum_value,options:i}),H}return qe(e.data)}get enum(){return this._def.values}};Qn.create=(t,e)=>new Qn({values:t,typeName:F.ZodNativeEnum,...Z(e)});var In=class extends J{unwrap(){return this._def.type}_parse(e){let{ctx:n}=this._processInputParams(e);if(n.parsedType!==L.promise&&n.common.async===!1)return M(n,{code:S.invalid_type,expected:L.promise,received:n.parsedType}),H;let r=n.parsedType===L.promise?n.data:Promise.resolve(n.data);return qe(r.then(i=>this._def.type.parseAsync(i,{path:n.path,errorMap:n.common.contextualErrorMap})))}};In.create=(t,e)=>new In({type:t,typeName:F.ZodPromise,...Z(e)});var kt=class extends J{innerType(){return this._def.schema}sourceType(){return this._def.schema._def.typeName===F.ZodEffects?this._def.schema.sourceType():this._def.schema}_parse(e){let{status:n,ctx:r}=this._processInputParams(e),i=this._def.effect||null,o={addIssue:s=>{M(r,s),s.fatal?n.abort():n.dirty()},get path(){return r.path}};if(o.addIssue=o.addIssue.bind(o),i.type==="preprocess"){let s=i.transform(r.data,o);if(r.common.async)return Promise.resolve(s).then(async a=>{if(n.value==="aborted")return H;let p=await this._def.schema._parseAsync({data:a,path:r.path,parent:r});return p.status==="aborted"?H:p.status==="dirty"?Fn(p.value):n.value==="dirty"?Fn(p.value):p});{if(n.value==="aborted")return H;let a=this._def.schema._parseSync({data:s,path:r.path,parent:r});return a.status==="aborted"?H:a.status==="dirty"?Fn(a.value):n.value==="dirty"?Fn(a.value):a}}if(i.type==="refinement"){let s=a=>{let p=i.refinement(a,o);if(r.common.async)return Promise.resolve(p);if(p instanceof Promise)throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");return a};if(r.common.async===!1){let a=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});return a.status==="aborted"?H:(a.status==="dirty"&&n.dirty(),s(a.value),{status:n.value,value:a.value})}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(a=>a.status==="aborted"?H:(a.status==="dirty"&&n.dirty(),s(a.value).then(()=>({status:n.value,value:a.value}))))}if(i.type==="transform")if(r.common.async===!1){let s=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});if(!Mn(s))return H;let a=i.transform(s.value,o);if(a instanceof Promise)throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");return{status:n.value,value:a}}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(s=>Mn(s)?Promise.resolve(i.transform(s.value,o)).then(a=>({status:n.value,value:a})):H);te.assertNever(i)}};kt.create=(t,e,n)=>new kt({schema:t,typeName:F.ZodEffects,effect:e,...Z(n)});kt.createWithPreprocess=(t,e,n)=>new kt({schema:e,effect:{type:"preprocess",transform:t},typeName:F.ZodEffects,...Z(n)});var yt=class extends J{_parse(e){return this._getType(e)===L.undefined?qe(void 0):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}};yt.create=(t,e)=>new yt({innerType:t,typeName:F.ZodOptional,...Z(e)});var Gt=class extends J{_parse(e){return this._getType(e)===L.null?qe(null):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}};Gt.create=(t,e)=>new Gt({innerType:t,typeName:F.ZodNullable,...Z(e)});var er=class extends J{_parse(e){let{ctx:n}=this._processInputParams(e),r=n.data;return n.parsedType===L.undefined&&(r=this._def.defaultValue()),this._def.innerType._parse({data:r,path:n.path,parent:n})}removeDefault(){return this._def.innerType}};er.create=(t,e)=>new er({innerType:t,typeName:F.ZodDefault,defaultValue:typeof e.default=="function"?e.default:()=>e.default,...Z(e)});var tr=class extends J{_parse(e){let{ctx:n}=this._processInputParams(e),r={...n,common:{...n.common,issues:[]}},i=this._def.innerType._parse({data:r.data,path:r.path,parent:{...r}});return _r(i)?i.then(o=>({status:"valid",value:o.status==="valid"?o.value:this._def.catchValue({get error(){return new ct(r.common.issues)},input:r.data})})):{status:"valid",value:i.status==="valid"?i.value:this._def.catchValue({get error(){return new ct(r.common.issues)},input:r.data})}}removeCatch(){return this._def.innerType}};tr.create=(t,e)=>new tr({innerType:t,typeName:F.ZodCatch,catchValue:typeof e.catch=="function"?e.catch:()=>e.catch,...Z(e)});var Cr=class extends J{_parse(e){if(this._getType(e)!==L.nan){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:L.nan,received:r.parsedType}),H}return{status:"valid",value:e.data}}};Cr.create=t=>new Cr({typeName:F.ZodNaN,...Z(t)});var Qu=Symbol("zod_brand"),so=class extends J{_parse(e){let{ctx:n}=this._processInputParams(e),r=n.data;return this._def.type._parse({data:r,path:n.path,parent:n})}unwrap(){return this._def.type}},lo=class t extends J{_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.common.async)return(async()=>{let o=await this._def.in._parseAsync({data:r.data,path:r.path,parent:r});return o.status==="aborted"?H:o.status==="dirty"?(n.dirty(),Fn(o.value)):this._def.out._parseAsync({data:o.value,path:r.path,parent:r})})();{let i=this._def.in._parseSync({data:r.data,path:r.path,parent:r});return i.status==="aborted"?H:i.status==="dirty"?(n.dirty(),{status:"dirty",value:i.value}):this._def.out._parseSync({data:i.value,path:r.path,parent:r})}}static create(e,n){return new t({in:e,out:n,typeName:F.ZodPipeline})}},nr=class extends J{_parse(e){let n=this._def.innerType._parse(e),r=i=>(Mn(i)&&(i.value=Object.freeze(i.value)),i);return _r(n)?n.then(i=>r(i)):r(n)}unwrap(){return this._def.innerType}};nr.create=(t,e)=>new nr({innerType:t,typeName:F.ZodReadonly,...Z(e)});function ks(t,e){let n=typeof t=="function"?t(e):typeof t=="string"?{message:t}:t;return typeof n=="string"?{message:n}:n}function Es(t,e={},n){return t?Ln.create().superRefine((r,i)=>{let o=t(r);if(o instanceof Promise)return o.then(s=>{if(!s){let a=ks(e,r),p=a.fatal??n??!0;i.addIssue({code:"custom",...a,fatal:p})}});if(!o){let s=ks(e,r),a=s.fatal??n??!0;i.addIssue({code:"custom",...s,fatal:a})}}):Ln.create()}var ed={object:ut.lazycreate},F;(function(t){t.ZodString="ZodString",t.ZodNumber="ZodNumber",t.ZodNaN="ZodNaN",t.ZodBigInt="ZodBigInt",t.ZodBoolean="ZodBoolean",t.ZodDate="ZodDate",t.ZodSymbol="ZodSymbol",t.ZodUndefined="ZodUndefined",t.ZodNull="ZodNull",t.ZodAny="ZodAny",t.ZodUnknown="ZodUnknown",t.ZodNever="ZodNever",t.ZodVoid="ZodVoid",t.ZodArray="ZodArray",t.ZodObject="ZodObject",t.ZodUnion="ZodUnion",t.ZodDiscriminatedUnion="ZodDiscriminatedUnion",t.ZodIntersection="ZodIntersection",t.ZodTuple="ZodTuple",t.ZodRecord="ZodRecord",t.ZodMap="ZodMap",t.ZodSet="ZodSet",t.ZodFunction="ZodFunction",t.ZodLazy="ZodLazy",t.ZodLiteral="ZodLiteral",t.ZodEnum="ZodEnum",t.ZodEffects="ZodEffects",t.ZodNativeEnum="ZodNativeEnum",t.ZodOptional="ZodOptional",t.ZodNullable="ZodNullable",t.ZodDefault="ZodDefault",t.ZodCatch="ZodCatch",t.ZodPromise="ZodPromise",t.ZodBranded="ZodBranded",t.ZodPipeline="ZodPipeline",t.ZodReadonly="ZodReadonly"})(F||(F={}));var td=(t,e={message:`Input not instance of ${t.name}`})=>Es(n=>n instanceof t,e),_s=Bn.create,As=jn.create,nd=Cr.create,rd=Vn.create,Ms=Gn.create,od=Un.create,id=Mr.create,ad=qn.create,sd=Zn.create,ld=Ln.create,cd=ln.create,ud=Dt.create,dd=Br.create,pd=cn.create,md=ut.create,fd=ut.strictCreate,hd=Wn.create,gd=ti.create,vd=Kn.create,yd=Vt.create,bd=ni.create,kd=Lr.create,wd=Ir.create,xd=ri.create,Td=Yn.create,Sd=Jn.create,Ed=Xn.create,_d=Qn.create,Ad=In.create,Md=kt.create,Bd=yt.create,Ld=Gt.create,Id=kt.createWithPreprocess,Cd=lo.create,Dd=()=>_s().optional(),Rd=()=>As().optional(),Pd=()=>Ms().optional(),Od={string:(t=>Bn.create({...t,coerce:!0})),number:(t=>jn.create({...t,coerce:!0})),boolean:(t=>Gn.create({...t,coerce:!0})),bigint:(t=>Vn.create({...t,coerce:!0})),date:(t=>Un.create({...t,coerce:!0}))};var Nd=H;var Bs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 5l0 14" />
  <path d="M5 12l14 0" />
</svg>`;var Ls=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-alarm-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 13a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
  <path d="M7 4l-2.75 2" />
  <path d="M17 4l2.75 2" />
  <path d="M10 13h4" />
  <path d="M12 11v4" />
</svg>`;var Is=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12l14 0" />
</svg>`;var Cs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M9 12h6" />
  <path d="M12 9v6" />
</svg>`;var Ds=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l6 0" />
</svg>`;var Rs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 7l16 0" />
  <path d="M10 11l0 6" />
  <path d="M14 11l0 6" />
  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
</svg>`;var Ps=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
  <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
</svg>`;var Os=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
</svg>`;var Ns=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-clock-plus"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20.984 12.535a9 9 0 1 0 -8.468 8.45" />
  <path d="M16 19h6" />
  <path d="M19 16v6" />
  <path d="M12 7v5l3 3" />
</svg>`;var zs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
</svg>`;var Hs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-player-record"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
</svg>`;var $s=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
</svg>`;var Fs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M9 12l2 2l4 -4" />
</svg>`;var js=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-adjustments-horizontal"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 6l8 0" />
  <path d="M16 6l4 0" />
  <path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 12l2 0" />
  <path d="M10 12l10 0" />
  <path d="M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M4 18l11 0" />
  <path d="M19 18l1 0" />
</svg>`;var Vs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-cloud"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878" />
</svg>`;var Gs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
  <path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  <path d="M14 4l0 4l-6 0l0 -4" />
</svg>`;var Us=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-folder-open"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" />
</svg>`;var qs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-export"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
</svg>`;var Zs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-import"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3" />
</svg>`;var Ws=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
</svg>`;var Ks=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
</svg>`;var Ys=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
</svg>`;var Js=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
</svg>`;var Xs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 9v4" />
  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
  <path d="M12 16h.01" />
</svg>`;var Qs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
</svg>`;var el=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
</svg>`;var tl=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
</svg>`;var nl=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
</svg>`;var rl=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-key"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
  <path d="M15 9h.01" />
</svg>`;var ol=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
</svg>`;var il=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
</svg>`;var al=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-decrease"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-7 0" />
  <path d="M20 12l-9 0" />
  <path d="M20 18l-7 0" />
  <path d="M8 8l-4 4l4 4" />
</svg>`;var gp={plus:Bs,"alarm-plus":Ls,minus:Is,"circle-plus":Cs,"circle-minus":Ds,trash:Rs,clipboard:Ps,settings:Os,"clock-plus":Ns,"current-location":zs,"player-record":Hs,"circle-x":$s,"circle-check":Fs,"adjustments-horizontal":js,cloud:Vs,"device-floppy":Gs,"folder-open":Us,"file-export":qs,"file-import":Zs,"file-spreadsheet":Ws,login:Ks,logout:Ys,refresh:Js,"alert-triangle":Xs,database:Qs,server:el,world:tl,"plug-connected":nl,key:rl,x:ol,"indent-increase":il,"indent-decrease":al},sl="http://www.w3.org/2000/svg",vp=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,yp=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,bp=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,ll=new Map;function cl(t){let e={};for(let n of t.matchAll(bp))e[n[1]]=n[2];return e}function kp(t){return t.startsWith("data:image/svg+xml;base64,")?atob(t.slice(26)):t.startsWith("data:image/svg+xml,")?decodeURIComponent(t.slice(19)):t}function wp(t){let e=kp(t).match(vp);if(!e)throw new Error("Invalid Tabler SVG source");let[,n,r]=e,i=document.createElementNS(sl,"svg"),o=cl(n);for(let[s,a]of Object.entries(o))s!=="class"&&i.setAttribute(s,a);for(let s of r.matchAll(yp)){let[,a,p]=s,c=document.createElementNS(sl,a),u=cl(p);for(let[g,y]of Object.entries(u))c.setAttribute(g,y);i.appendChild(c)}return i}function xp(t){let e=ll.get(t);if(e)return e;let n=wp(gp[t]);return ll.set(t,n),n}function Dr(t,e=20){let n=xp(t).cloneNode(!0);return n.setAttribute("width",String(e)),n.setAttribute("height",String(e)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function Ze(t,e,n){t.replaceChildren(Dr(e,n))}function ce(t,e,n,r){t.replaceChildren(Dr(e,r),document.createTextNode("\xA0"+n))}var rr="5.0.18";function d(t,...e){let n="debug",r=[...e];e.length>0&&typeof e[e.length-1]=="string"&&["debug","info","warn","error"].includes(e[e.length-1])&&(n=r.pop());let i=`[Timekeeper v${rr}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${i} ${t}`,...r)}function Ut(t,e=t){let n=Math.floor(t/3600),r=Math.floor(t%3600/60),i=String(t%60).padStart(2,"0");return e<3600?`${e>=600?String(r).padStart(2,"0"):r}:${i}`:`${e>=36e3?String(n).padStart(2,"0"):n}:${String(r).padStart(2,"0")}:${i}`}function $i(t,e=window.location.href){try{let n=new URL(e);return n.searchParams.set("t",`${t}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${e.search(/[?&]v=/)>=0?e.split(/[?&]v=/)[1].split(/&/)[0]:e.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${t}s`}}function or(){let t=new Date;return t.getUTCFullYear()+"-"+String(t.getUTCMonth()+1).padStart(2,"0")+"-"+String(t.getUTCDate()).padStart(2,"0")+"--"+String(t.getUTCHours()).padStart(2,"0")+"-"+String(t.getUTCMinutes()).padStart(2,"0")+"-"+String(t.getUTCSeconds()).padStart(2,"0")}var ul=`#ytls-pane {
  background: rgba(19, 19, 19, 0.8);
  text-align: left;
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0;
  margin: 0;
  border-radius: 12px;
  /* Add rounded corners */
  border: 1px solid rgba(85, 85, 85, 0.8);
  /* Add a thin grey border */
  opacity: 0.9;
  z-index: 5000;
  font-family: Arial, sans-serif;
  width: 300px;
  height: 90vh;
  min-width: 300px;
  max-width: 800px;
  min-height: 400px;
  max-height: 90vh;
  user-select: none;
  /* Prevent text selection in pane */
  display: flex;
  flex-direction: column;
  will-change: width, height;
  transform: translateZ(0);
  backface-visibility: hidden;
  contain: layout style paint;
  overflow: hidden;
}

#ytls-pane:hover {
  opacity: 1;
}

/* Legacy corner handle: keep element for resize behavior but hide visual indicator */
/* Legacy corner handle kept for compatibility but hidden visually */
#ytls-resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: auto;
  /* no visible corner cursor */
  z-index: 10;
  pointer-events: none;
  /* legacy handle inactive, corners handle events */
  background: transparent;
  margin: 0;
  padding: 0;
}

#ytls-resize-handle::before {
  display: none;
  /* remove the triangular corner indicator */
  content: none;
}

/* Corner handles for diagonal resize */
#ytls-resize-tl,
#ytls-resize-tr,
#ytls-resize-bl,
#ytls-resize-br {
  position: absolute;
  /* Use 16px click areas for corner resize handlers to match touch targets and reduce accidental drags */
  width: 16px;
  height: 16px;
  z-index: 11;
  background: transparent;
  pointer-events: auto;
}

#ytls-resize-tl {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}

#ytls-resize-tr {
  top: 0;
  right: 0;
  cursor: nesw-resize;
}

#ytls-resize-bl {
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

#ytls-resize-br {
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}

#ytls-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  position: relative;
}

/* Wrapper that gives the custom scrollbar a positioned ancestor covering only the list area */
#ytls-list-wrapper {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

#ytls-content ul {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 !important;
  border: none !important;
  box-sizing: border-box;
  scrollbar-width: none;
  /* Firefox: hide native scrollbar */
}

#ytls-content ul::-webkit-scrollbar {
  display: none;
  /* WebKit: hide native scrollbar */
}

/* Custom overlay scrollbar track */
.ytls-scrollbar-track {
  --ytls-scrollbar-size: 10px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--ytls-scrollbar-size);
  pointer-events: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 2;
}

.ytls-scrollbar-track.ytls-scrollbar-visible {
  opacity: 1;
}

/* Custom overlay scrollbar thumb */
.ytls-scrollbar-thumb {
  position: absolute;
  right: 2px;
  width: calc(var(--ytls-scrollbar-size) - 4px);
  min-height: 30px;
  background: rgba(255, 255, 255, 0.42);
  border-radius: 999px;
  transition: background 0.15s ease;
}

.ytls-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.62);
}

/* Placeholder message shown centered in the list area while loading or when empty */
#ytls-content ul li.ytls-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: #bfbfbf;
  font-size: 14px;
  font-style: italic;
  padding: 12px;
  text-align: center;
  box-sizing: border-box;
}

#ytls-pane-header {
  position: relative;
  z-index: 2;
}

#ytls-buttons {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 10px 18px 10px 16px;
  background: #131313;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #23272b;
  margin-top: auto;
}

#ytls-pane li {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  margin: 0 !important;
  border: none;
  border-top: 1px solid rgba(85, 85, 85, 0.8);
  user-select: none;
  /* Prevent text selection in timestamp items */
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

#ytls-pane li:first-child {
  border-top: none;
}

#ytls-pane li.ytls-timestamp-highlight {
  background: rgba(35, 48, 36, 0.8);
}

#ytls-pane li.ytls-timestamp-pending-delete {
  background: rgba(128, 0, 0, 0.8);
}

#ytls-pane .time-row {
  display: flex;
  gap: 5px;
  align-items: center;
}

#ytls-pane .time-row a {
  flex: 0 0 8ch;
  /* Reserve fixed hh:mm:ss width so controls don't shift */
  width: 8ch;
  min-width: 8ch;
  max-width: 8ch;
  display: inline-block;
  text-align: left;
  /* Align the text to the left */
  overflow: hidden;
  /* Prevent overflow */
  text-overflow: ellipsis;
  /* Add ellipsis for long text */
  white-space: nowrap;
  /* Prevent wrapping */
  font-variant-numeric: tabular-nums;
}

#ytls-pane .time-row .time-diff {
  flex-grow: 1;
  /* Allow time-diff to fill remaining space */
  text-align: right;
  /* Align time diff text to the right, next to trash icon */
}

#ytls-pane .time-row .ytls-row-controls {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 5px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

#ytls-pane li:hover .time-row .ytls-row-controls {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

#ytls-pane .ytls-marker {
  position: absolute;
  height: 100%;
  width: 2px;
  background-color: #ff0000;
  cursor: pointer;
}

#ytls-pane [data-time] {
  cursor: pointer;
}

#ytls-pane span,
#ytls-pane a,
#ytls-pane input {
  background: none;
  color: white;
  font-family: inherit;
  font-size: 14px;
  text-decoration: none;
  border: none;
  outline: none;
}

/* Ensure editing controls behave like editable fields despite parent user-select:none */
#ytls-pane input,
#ytls-pane textarea {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  caret-color: white;
}

#ytls-buttons {
  flex-shrink: 0;
  display: flex;
  gap: 5px;
  justify-content: space-between;
  padding: 8px 12px;
  background: #131313;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid rgba(85, 85, 85, 0.8);
  z-index: 2;
  /* Ensure it stays at the bottom */
}

#ytls-buttons button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Styles for main control buttons */
.ytls-main-button {
  background: rgb(39, 39, 39);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  touch-action: manipulation;
}

.ytls-main-button:hover {
  background: rgb(63, 63, 63);
}

.ytls-main-button svg {
  display: block;
  width: 24px;
  height: 24px;
}

/* Pane header and utility styles */
#ytls-pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px 10px 16px;
  white-space: nowrap;
  cursor: default;
  border-radius: 12px 12px 0 0;
  border: none;
  background: linear-gradient(180deg, #23272b 0%, #212121 100%);
  box-shadow: 0 1px 0 0 #23272b;
  flex-shrink: 0;
  color: #fafafa;
}

#ytls-pane .ytls-version-display {
  font-size: 14px;
  color: #666;
  margin-left: auto;
  padding-right: 5px;
  cursor: default;
}

#ytls-pane .ytls-google-user-display {
  font-size: 12px;
  color: #4285f4;
  margin-left: 8px;
  padding: 2px 6px;
  cursor: default;
  background: rgba(66, 133, 244, 0.1);
  border-radius: 4px;
}

#ytls-pane .ytls-backup-status-display {
  font-size: 12px;
  color: #9acd32;
  /* yellowgreen */
  margin-left: 8px;
  padding: 2px 6px;
  cursor: default;
  background: rgba(154, 205, 50, 0.12);
  border-radius: 4px;
}

#ytls-current-time {
  color: white;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

#ytls-playback-speed {
  color: white;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  padding: 0 2px;
  border-radius: 3px;
  outline: none;
  display: inline-block;
  width: 5ch;
  text-align: center;
  transition: filter 0.2s ease;
}

#ytls-playback-speed:hover {
  text-decoration: underline;
}

#ytls-playback-speed.ytls-playback-speed-active {
  color: #f4ba78;
}

#ytls-playback-speed-group {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  align-self: center;
}

/* Backup status indicator (colored dot) */
.ytls-backup-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #666;
  cursor: help;
  flex-shrink: 0;
}

@keyframes ytls-pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.25;
  }
}

.ytls-backup-indicator--pulsing {
  animation: ytls-pulse 1.6s ease-in-out infinite;
}

/* Shared modal container styles */
#ytls-settings-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1a1a1a;
  padding: 8px;
  border-radius: 10px;
  z-index: 10000;
  color: white;
  text-align: center;
  width: 200px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

#ytls-save-modal,
#ytls-load-modal,
#ytls-delete-all-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #333;
  padding: 8px;
  border-radius: 10px;
  z-index: 10000;
  color: white;
  text-align: center;
  width: fit-content;
  max-width: 90vw;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Modal header with tabs and close button */
.ytls-modal-header {
  display: flex;
  align-items: flex-end;
  margin-bottom: 0;
  gap: 10px;
}

/* Modal close button (X in header) */
.ytls-modal-close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  z-index: 1;
}

.ytls-modal-close-button:hover {
  background: #ff6666;
}

/* Styles for settings modal */
#ytls-settings-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  background: #2a2a2a;
  border: 2px solid #3a3a3a;
  border-radius: 0 4px 4px 4px;
  padding: 10px;
  margin-top: -2px;
  position: relative;
  z-index: 1;
}

/* Section heading */
.ytls-section-heading {
  margin: 0 0 10px 0;
  padding: 0;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}

/* Settings nav (tabs) */
#ytls-settings-nav {
  display: flex;
  gap: 6px;
  flex: 0;
}

#ytls-settings-nav .ytls-settings-modal-button {
  flex: 0;
  width: auto;
  height: 24px;
  margin-bottom: 0;
  background: #2a2a2a;
  font-size: 13px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid transparent;
  border-radius: 4px 4px 0 0;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  position: relative;
}

#ytls-settings-nav .ytls-settings-modal-button .ytls-tab-text {
  display: none;
}

#ytls-settings-nav .ytls-settings-modal-button.active .ytls-tab-text {
  display: inline;
}

#ytls-settings-nav .ytls-settings-modal-button:hover {
  background: #3a3a3a;
}

#ytls-settings-nav .ytls-settings-modal-button.active {
  background: #2a2a2a;
  border: 2px solid #3a3a3a;
  border-bottom: 2px solid #2a2a2a;
  z-index: 2;
}

/* Button grid container */
.ytls-button-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;
  width: 100%;
}

/* Styles for buttons in the settings modal */
.ytls-settings-modal-button {
  width: 100%;
  height: 32px;
  background: #555;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  padding: 0 8px;
  gap: 4px;
}

.ytls-settings-modal-button:hover {
  background: #777;
  /* Example hover effect */
}

/* Tabler icon sizing in pane controls */
#ytls-pane .time-row span svg,
#ytls-pane .time-row button svg {
  display: block;
  flex-shrink: 0;
  pointer-events: none;
}

/* Route SVG clicks to their parent controls for consistent interaction */
.ytls-main-button svg,
.ytls-settings-modal-button svg,
.ytls-save-modal-button svg,
.ytls-save-modal-cancel-button svg,
.ytls-modal-close-button svg,
#ytls-header-button svg {
  pointer-events: none;
}

/* Reduce mobile tap delay for button-like controls */
.ytls-row-control,
.ytls-settings-modal-button,
.ytls-save-modal-button,
.ytls-save-modal-cancel-button,
.ytls-modal-close-button,
#ytls-header-button,
#ytls-buttons button {
  touch-action: manipulation;
}

/* Shared styles for modal copy */
#ytls-save-modal p,
#ytls-load-modal p,
#ytls-delete-all-modal p {
  margin-bottom: 15px;
  font-size: 16px;
}

.ytls-save-modal-button {
  background: #555;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  /* Applied to both JSON and Text buttons, last one will have extra margin if not overridden */
}

.ytls-save-modal-button:last-of-type {
  /* Remove margin from the last button of this type in the modal */
  margin-right: 0;
}

.ytls-save-modal-cancel-button {
  background: #444;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  display: block;
  width: 100%;
}

/* Styles for file operation buttons (Save, Load, Export, Import) if they were to be displayed directly */
/* Note: These buttons (saveBtn, loadBtn, etc.) are not directly added to the UI with these styles. */
/* Their onclick handlers are used by the settings modal buttons which use .ytls-settings-modal-button. */
.ytls-file-operation-button {
  background: #555;
  color: white;
  font-size: 12px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.ytls-file-operation-button:hover {
  background: #777;
  /* Example hover effect */
}

.ytls-hidden-file-input {
  display: none;
}

#ytls-header-button {
  align-items: center;
  background: transparent;
  border: none;
  color: var(--yt-spec-text-primary, currentColor);
  cursor: pointer;
  display: inline-flex;
  font-size: 20px;
  height: 40px;
  margin-left: 6px;
  padding: 0 6px;
  text-decoration: none;
}

#ytls-header-button:hover {
  color: var(--yt-spec-call-to-action, #3ea6ff);
}

#ytls-header-button:focus-visible {
  outline: 2px solid var(--yt-spec-call-to-action, #3ea6ff);
  outline-offset: 2px;
}

#ytls-header-button img {
  display: block;
  height: 32px;
  max-width: 48px;
  pointer-events: none;
  width: auto;
}

/* Shared fade animations for pane and modals */
.ytls-fade-in {
  animation: fadeIn 0.3s ease-in-out forwards;
}

.ytls-fade-out {
  animation: fadeOut 0.3s ease-in-out forwards;
}

/* Zoom animations for pane expand/collapse */
.ytls-zoom-in {
  animation: zoomIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  transform-origin: center center;
}

.ytls-zoom-out {
  animation: zoomOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  transform-origin: center center;
}

/* Fade-in animation for modals */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Fade-out animation for modals */
@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

/* Zoom-in animation - expand from point */
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.1);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Zoom-out animation - collapse to point */
@keyframes zoomOut {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.1);
  }
}

/* Custom tooltip styles */
.ytls-tooltip {
  position: fixed;
  background: rgba(97, 97, 97, 0.92);
  color: #fff;
  padding: 8px 10px;
  border-radius: 2px;
  font-size: 12px;
  font-family: "Roboto", "Arial", sans-serif;
  font-weight: normal;
  line-height: 1.4;
  letter-spacing: 0.2px;
  z-index: 10001;
  pointer-events: none;
  white-space: pre-line;
  max-width: 300px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.0, 0.0, 0.2, 1);
}

.ytls-tooltip.ytls-tooltip-visible {
  opacity: 1;
}
`;var dt=null,Rr=null,Tp=250,qt=null,Pr=!1,pt=null,co=[];function Sp(){return(!dt||!document.body.contains(dt))&&(dt=document.createElement("div"),dt.className="ytls-tooltip",dt.style.pointerEvents="none",document.body.appendChild(dt),window.addEventListener("scroll",dl,!0),window.addEventListener("resize",dl,!0)),dt}function Ep(t,e,n){let i=window.innerWidth,o=window.innerHeight,s=t.getBoundingClientRect(),a=s.width,p=s.height,c=e+10,u=n+10;c+a>i-10&&(c=e-a-10),u+p>o-10&&(u=n-p-10),c=Math.max(10,Math.min(c,i-a-10)),u=Math.max(10,Math.min(u,o-p-10)),t.style.left=`${c}px`,t.style.top=`${u}px`}function pl(t,e){let r=window.innerWidth,i=window.innerHeight,o=e.getBoundingClientRect(),s=t.getBoundingClientRect(),a=s.width,p=s.height,c=Math.round(o.left+o.width/2-a/2),u=Math.round(o.top-p-8);u<8&&(u=Math.round(o.bottom+8)),c<8&&(c=Math.round(o.left)),c+a>r-8&&(c=Math.round(o.right-a)),c=Math.max(8,Math.min(c,r-a-8)),u=Math.max(8,Math.min(u,i-p-8)),t.style.left=`${c}px`,t.style.top=`${u}px`}function dl(){if(!(!dt||!qt)&&dt.classList.contains("ytls-tooltip-visible"))try{pl(dt,qt)}catch{}}function _p(t=50){pt&&(clearTimeout(pt),pt=null),!Pr&&(pt=setTimeout(()=>{uo(),pt=null},t))}function Ap(t,e,n,r){pt&&(clearTimeout(pt),pt=null),qt&&r&&qt!==r&&dt?.classList.contains("ytls-tooltip-visible")&&dt.classList.remove("ytls-tooltip-visible"),Rr&&clearTimeout(Rr),r&&(qt=r,Pr=!0),Rr=setTimeout(()=>{let i=Sp();i.textContent=t,i.classList.remove("ytls-tooltip-visible"),r?requestAnimationFrame(()=>{pl(i,r),requestAnimationFrame(()=>{i.classList.add("ytls-tooltip-visible")})}):(Ep(i,e,n),requestAnimationFrame(()=>{i.classList.add("ytls-tooltip-visible")}))},Tp)}function uo(){Rr&&(clearTimeout(Rr),Rr=null),pt&&(clearTimeout(pt),pt=null),dt&&dt.classList.remove("ytls-tooltip-visible"),qt=null,Pr=!1}function Fi(){uo()}function tt(t,e){let n=0,r=0,i=c=>{n=c.clientX,r=c.clientY,pt&&(clearTimeout(pt),pt=null),Pr=!0,qt=t;let u=typeof e=="function"?e():e;u&&Ap(u,n,r,t)},o=c=>{n=c.clientX,r=c.clientY},s=()=>{qt===t&&(Pr=!1,_p())};t.addEventListener("mouseenter",i),t.addEventListener("mousemove",o),t.addEventListener("mouseleave",s);let a=c=>{Pr=!1,qt===t&&uo()};t.addEventListener("click",a,!0);let p=new MutationObserver(()=>{if(qt===t)try{let c=window.getComputedStyle(t);(c.display==="none"||c.visibility==="hidden"||c.opacity==="0")&&uo()}catch{}});try{p.observe(t,{attributes:!0,attributeFilter:["class","style"]})}catch{}co.push(p),t.__tooltipCleanup=()=>{t.removeEventListener("mouseenter",i),t.removeEventListener("mousemove",o),t.removeEventListener("mouseleave",s),t.removeEventListener("click",a,!0);try{p.disconnect()}catch{}let c=co.indexOf(p);c!==-1&&co.splice(c,1),delete t.__tooltipObserver},t.__tooltipObserver=p}function ml(){for(let t of co)try{t.disconnect()}catch{}co.length=0,uo()}var Ki={};vs(Ki,{addTimestamp:()=>Op,buildExportCsvPayload:()=>Gp,buildExportPayload:()=>jp,deleteSingleTimestampFromIndexedDB:()=>$p,exportAllTimestamps:()=>Vp,exportAllTimestampsCsv:()=>Up,loadFromIndexedDB:()=>Hp,loadGlobalSettings:()=>si,mergeBackupData:()=>qp,removeFromIndexedDB:()=>Fp,saveGlobalSettings:()=>ai,saveSingleTimestampToIndexedDB:()=>zp,saveToIndexedDB:()=>Np});var Mp=z.string().min(1),Or=z.object({guid:Mp,start:z.number().finite().nonnegative(),comment:z.string(),write_counter:z.number().int().positive().optional(),deleted_at:z.number().optional().catch(void 0)}),po=Or.array(),ji=Or.extend({video_id:z.string(),device_id:z.string().optional()}),hl=z.object({x:z.number().finite(),y:z.number().finite(),width:z.number().finite().positive().optional(),height:z.number().finite().positive().optional()}),oi=z.object({video_id:z.string(),timestamps:po}),gl=z.record(oi),fl=z.object({isSignedIn:z.boolean().catch(!1),accessToken:z.string().nullable().catch(null),userName:z.string().nullable().catch(null),email:z.string().nullable().catch(null)}),Vi=z.union([fl,z.string().transform((t,e)=>{try{let n=JSON.parse(t);return fl.parse(n)}catch{return e.addIssue({code:z.ZodIssueCode.custom,message:"Invalid JSON string for auth state"}),z.NEVER}})]).catch({isSignedIn:!1,accessToken:null,userName:null,email:null}),Bp=z.object({autoBackupEnabled:z.boolean(),autoBackupIntervalMinutes:z.number().int().min(5).max(1440),lastAutoBackupAt:z.number().int().positive().nullable().optional()}),Lp=z.object({timekeeperBackendBackupEnabled:z.boolean(),timekeeperBackendHost:z.string().trim().min(1),timekeeperBackendPort:z.number().int().min(1).max(65535),timekeeperBackendBearerToken:z.string().trim().min(1).nullable()}),Gi=Bp.extend(Lp.shape);var Ip="ytls-timestamps-db",Cp=4,Nr="timestamps",Ke="timestamps_v2",We="settings",zr=null,Hr=null;var Zt=null;function ir(){if(zr)try{return zr.objectStoreNames,Promise.resolve(zr)}catch(t){d("IndexedDB connection is no longer usable:",t,"warn"),zr=null}return Hr||(Hr=Dp().then(t=>(zr=t,Hr=null,t.onclose=()=>{d("IndexedDB connection closed unexpectedly","warn"),zr=null},t.onerror=e=>{d("IndexedDB connection error:",e,"error")},t)).catch(t=>{throw Hr=null,t}),Hr)}function vl(t,e){let n=crypto.randomUUID(),r=0,i=t.openCursor();i.onsuccess=o=>{let s=o.target.result;s?(r++,s.update({...s.value,write_counter:r,device_id:n}),s.continue()):(e.put({key:"write_counter",value:r}),e.put({key:"device_id",value:n}),d(`Lamport migration: backfilled ${r} records, device_id=${n}`))},i.onerror=()=>{d("Lamport migration: cursor error during backfill",i.error,"error")}}function Dp(){return new Promise((t,e)=>{let n=indexedDB.open(Ip,Cp);n.onupgradeneeded=r=>{let i=r.target.result,o=r.oldVersion,s=r.target.transaction;if(o<1&&i.createObjectStore(Nr,{keyPath:"video_id"}),o<2&&!i.objectStoreNames.contains(We)&&i.createObjectStore(We,{keyPath:"key"}),o<3){if(i.objectStoreNames.contains(Nr)){d("Exporting backup before v2 migration...");let c=s.objectStore(Nr).getAll();c.onsuccess=()=>{let u=oi.array().safeParse(c.result);if(u.success&&u.data.length>0)try{let g={},y=0;u.data.forEach($=>{if($.timestamps.length>0){let X=po.parse($.timestamps);g[`ytls-${$.video_id}`]={video_id:$.video_id,timestamps:[...X].sort((C,R)=>C.start-R.start)},y+=X.length}});let _=new Blob([JSON.stringify(g,null,2)],{type:"application/json"}),P=URL.createObjectURL(_),V=document.createElement("a");V.href=P,V.download=`timekeeper-data-${or()}.json`,V.click(),URL.revokeObjectURL(P),d(`Pre-migration backup exported: ${u.data.length} videos, ${y} timestamps`)}catch(g){d("Failed to export pre-migration backup:",g,"error")}else u.success||d("Skipping pre-migration backup: legacy data failed validation",u.error.format(),"warn")}}let a=i.createObjectStore(Ke,{keyPath:"guid"});if(a.createIndex("video_id","video_id",{unique:!1}),a.createIndex("video_start",["video_id","start"],{unique:!1}),i.objectStoreNames.contains(Nr)){let c=s.objectStore(Nr).getAll();c.onsuccess=()=>{let u=oi.array().safeParse(c.result);if(u.success&&u.data.length>0){let g=0;u.data.forEach(y=>{y.timestamps.length>0&&y.timestamps.forEach(_=>{a.put({guid:_.guid,video_id:y.video_id,start:_.start,comment:_.comment}),g++})}),d(`Migrated ${g} timestamps from ${u.data.length} videos to v2 store`)}else u.success||d("Skipping v1 \u2192 v2 migration: legacy data failed validation",u.error.format(),"warn");o<4&&vl(s.objectStore(Ke),s.objectStore(We))},i.deleteObjectStore(Nr),d("Deleted old timestamps store after migration to v2")}}o===3&&vl(s.objectStore(Ke),s.objectStore(We))},n.onsuccess=r=>{t(r.target.result)},n.onerror=r=>{let i=r.target.error;e(i??new Error("Failed to open IndexedDB"))}})}function Ui(t,e,n){return ir().then(r=>new Promise((i,o)=>{let s;try{s=r.transaction(t,e)}catch(c){o(new Error(`Failed to create transaction for ${t}: ${c}`));return}let a=s.objectStore(t),p;try{p=n(a)}catch(c){o(new Error(`Failed to execute operation on ${t}: ${c}`));return}p&&(p.onsuccess=()=>i(p.result),p.onerror=()=>o(p.error??new Error(`IndexedDB ${e} operation failed`))),s.oncomplete=()=>{p||i(void 0)},s.onerror=()=>o(s.error??new Error("IndexedDB transaction failed")),s.onabort=()=>o(s.error??new Error("IndexedDB transaction aborted"))}))}function yl(t,e){let n=po.safeParse(e);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${t}`));let r=n.data;return ir().then(i=>new Promise((o,s)=>{let a;try{a=i.transaction([Ke,We],"readwrite")}catch(y){s(new Error(`Failed to create transaction: ${y}`));return}a.oncomplete=()=>o(),a.onerror=()=>s(new Error(`IndexedDB save failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>s(new Error("IndexedDB transaction aborted"));let p=a.objectStore(Ke),c=a.objectStore(We),g=p.index("video_id").getAll(IDBKeyRange.only(t));g.onsuccess=()=>{try{let y=g.result??[],_=new Map(y.map(C=>[C.guid,C])),P=new Set(r.map(C=>C.guid)),V=Date.now(),$,X=c.get("write_counter");X.onsuccess=()=>{try{$=typeof X.result?.value=="number"?X.result.value:0}catch{$=0}y.forEach(C=>{!P.has(C.guid)&&!C.deleted_at&&($++,p.put({...C,deleted_at:V,write_counter:$}))}),r.forEach(C=>{let R=_.get(C.guid);if(R&&!R.deleted_at&&R.start===C.start&&R.comment===C.comment&&R.deleted_at===C.deleted_at)p.put({guid:C.guid,video_id:t,start:C.start,comment:C.comment,write_counter:R.write_counter,deleted_at:C.deleted_at,device_id:R.device_id});else{$++;let de=C.deleted_at??R?.deleted_at??void 0;p.put({guid:C.guid,video_id:t,start:C.start,comment:C.comment,write_counter:$,deleted_at:de})}}),c.put({key:"write_counter",value:$}),Zt=$},X.onerror=()=>{d("Failed to read write_counter during save, proceeding with counter=0",X.error,"warn"),$=0,y.forEach(C=>{!P.has(C.guid)&&!C.deleted_at&&($++,p.put({...C,deleted_at:V,write_counter:$}))}),r.forEach(C=>{let R=_.get(C.guid);if(R&&!R.deleted_at&&R.start===C.start&&R.comment===C.comment&&R.deleted_at===C.deleted_at)p.put({guid:C.guid,video_id:t,start:C.start,comment:C.comment,write_counter:R.write_counter,deleted_at:C.deleted_at,device_id:R.device_id});else{$++;let de=C.deleted_at??R?.deleted_at??void 0;p.put({guid:C.guid,video_id:t,start:C.start,comment:C.comment,write_counter:$,deleted_at:de})}}),c.put({key:"write_counter",value:$}),Zt=$}}catch(y){s(y instanceof Error?y:new Error(String(y)))}},g.onerror=()=>{let y=`Failed to load existing records for save: ${g.error?.message??"unknown"}`;d(y,g.error,"error"),s(new Error(y))}}))}function bl(t,e){let n=Or.safeParse(e);if(!n.success)return Promise.reject(new Error(`Invalid timestamp: ${n.error.message}`));let r=n.data;return ir().then(i=>new Promise((o,s)=>{let a;try{a=i.transaction([Ke,We],"readwrite")}catch(g){s(new Error(`Failed to create transaction: ${g}`));return}a.oncomplete=()=>o(),a.onerror=()=>s(new Error(`IndexedDB save failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>s(new Error("IndexedDB transaction aborted"));let p=a.objectStore(Ke),c=a.objectStore(We);p.put({guid:r.guid,video_id:t,start:r.start,comment:r.comment,write_counter:0,deleted_at:r.deleted_at});let u=c.get("write_counter");u.onsuccess=()=>{try{let g=typeof u.result?.value=="number"?u.result.value:0;p.put({guid:r.guid,video_id:t,start:r.start,comment:r.comment,write_counter:g+1,deleted_at:r.deleted_at}),c.put({key:"write_counter",value:g+1}),Zt=g+1}catch(g){s(g instanceof Error?g:new Error(String(g)))}},u.onerror=()=>{p.put({guid:r.guid,video_id:t,start:r.start,comment:r.comment,write_counter:1,deleted_at:r.deleted_at}),c.put({key:"write_counter",value:1}),Zt=1}}))}function kl(t){return t.length===0?Promise.resolve():ir().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke,We],"readwrite")}catch(c){r(new Error(`Failed to create transaction: ${c}`));return}i.oncomplete=()=>n(),i.onerror=()=>r(new Error(`IndexedDB batch save failed: ${i.error?.message??"unknown"}`)),i.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=i.objectStore(Ke),s=i.objectStore(We),a=0;t.forEach(c=>{c.write_counter!==void 0&&c.write_counter>a&&(a=c.write_counter)}),t.forEach(c=>{let u={guid:c.guid,video_id:c.video_id,start:c.start,comment:c.comment,deleted_at:c.deleted_at};c.write_counter===void 0?(a++,u.write_counter=a):u.write_counter=c.write_counter,o.put(u)});let p=s.get("write_counter");p.onsuccess=()=>{try{let c=typeof p.result?.value=="number"?p.result.value:0,u=Math.max(a,c)+1;s.put({key:"write_counter",value:u}),Zt=u}catch(c){r(c instanceof Error?c:new Error(String(c)))}},p.onerror=()=>{s.put({key:"write_counter",value:a+1}),Zt=a+1}}))}function wl(t){return d(`Soft-deleting timestamp ${t}`),ir().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke,We],"readwrite")}catch(p){r(new Error(`Failed to create transaction: ${p}`));return}i.oncomplete=()=>n(),i.onerror=()=>r(new Error(`IndexedDB delete failed: ${i.error?.message??"unknown"}`)),i.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=i.objectStore(Ke),s=i.objectStore(We),a=o.get(t);a.onsuccess=()=>{try{let p=a.result;if(p){let c=s.get("write_counter");c.onsuccess=()=>{try{let u=typeof c.result?.value=="number"?c.result.value:0;o.put({...p,deleted_at:Date.now(),write_counter:u+1}),s.put({key:"write_counter",value:u+1}),Zt=u+1}catch(u){r(u instanceof Error?u:new Error(String(u)))}},c.onerror=()=>{o.put({...p,deleted_at:Date.now(),write_counter:1}),s.put({key:"write_counter",value:1}),Zt=1}}}catch(p){r(p instanceof Error?p:new Error(String(p)))}},a.onerror=()=>{let p=`Failed to load record for deletion: ${a.error?.message??"unknown"}`;d(p,a.error,"error"),r(new Error(p))}}))}function xl(t){return ir().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke],"readonly")}catch(s){let a=`Failed to create read transaction: ${s}`;d(a,s,"error"),r(new Error(a));return}i.onabort=()=>{let s=`Transaction aborted during load: ${i.error?.message??"unknown"}`;d(s,i.error,"error"),r(new Error(s))};let o=i.objectStore(Ke).index("video_id").getAll(IDBKeyRange.only(t));o.onsuccess=()=>{try{let s=o.result.filter(c=>!c.deleted_at);if(s.length===0){n(null);return}let a=s.map(c=>({guid:c.guid,start:c.start,comment:c.comment})),p=po.safeParse(a);if(!p.success){d("Failed to parse timestamps from IndexedDB:",p.error.format(),"warn"),n(null);return}n([...p.data].sort((c,u)=>c.start-u.start))}catch(s){r(s)}},o.onerror=()=>{let s=`Failed to load timestamps from IndexedDB: ${o.error?.message??"unknown error"}`;d(s,o.error,"error"),r(new Error(s))}}))}function Tl(t){return ir().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke,We],"readwrite")}catch(c){r(new Error(`Failed to create transaction: ${c}`));return}i.oncomplete=()=>n(),i.onerror=()=>r(new Error(`IndexedDB delete failed: ${i.error?.message??"unknown"}`)),i.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=i.objectStore(Ke),s=i.objectStore(We),p=o.index("video_id").getAll(IDBKeyRange.only(t));p.onsuccess=()=>{try{let c=p.result??[],u=Date.now(),g=s.get("write_counter");g.onsuccess=()=>{try{let y;y=typeof g.result?.value=="number"?g.result.value:0,c.forEach(_=>{_.deleted_at||(y++,o.put({..._,deleted_at:u,write_counter:y}))}),s.put({key:"write_counter",value:y}),Zt=y}catch(y){r(y instanceof Error?y:new Error(String(y)))}},g.onerror=()=>{let y=0;c.forEach(_=>{_.deleted_at||(y++,o.put({..._,deleted_at:u,write_counter:y}))}),s.put({key:"write_counter",value:y}),Zt=y}}catch(c){r(c instanceof Error?c:new Error(String(c)))}},p.onerror=()=>{let c=`Failed to load records for deletion: ${p.error?.message??"unknown"}`;d(c,p.error,"error"),r(new Error(c))}}))}function ii(){return Ui(Ke,"readonly",t=>t.getAll()).then(t=>Array.isArray(t)?t:[])}function Sl(t,e){return Ui(We,"readwrite",n=>{n.put({key:t,value:e})}).then(()=>{}).catch(n=>{d(`Failed to save setting '${t}' to IndexedDB:`,n,"error")})}function El(t){return Ui(We,"readonly",e=>e.get(t)).then(e=>e?.value).catch(e=>{d(`Failed to load setting '${t}' from IndexedDB:`,e,"error")})}async function qi({includeDeleted:t=!1}={}){let e={},n=await ii(),r=ji.array().safeParse(n);if(!r.success)return d("Failed to parse timestamp rows for export:",r.error.format(),"warn"),{json:"{}",filename:"timekeeper-data.json",totalVideos:0,totalTimestamps:0};let o=[...t?r.data:r.data.filter(u=>!u.deleted_at)].sort((u,g)=>{let y=u.video_id.localeCompare(g.video_id);if(y!==0)return y;let _=u.start-g.start;return _!==0?_:u.guid.localeCompare(g.guid)}),s=new Map;for(let u of o)s.has(u.video_id)||s.set(u.video_id,[]),s.get(u.video_id).push({guid:u.guid,start:u.start,comment:u.comment,write_counter:u.write_counter,deleted_at:u.deleted_at});let a=Array.from(s.keys()).sort((u,g)=>u.localeCompare(g));for(let u of a){let g=s.get(u);e[`ytls-${u}`]={video_id:u,timestamps:g}}return{json:JSON.stringify(e,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:o.length}}async function _l(){try{let{json:t,filename:e,totalVideos:n,totalTimestamps:r}=await qi(),i=new Blob([t],{type:"application/json"}),o=URL.createObjectURL(i),s=document.createElement("a");s.href=o,s.download=e,s.click(),URL.revokeObjectURL(o),d(`Exported ${n} videos with ${r} timestamps`)}catch(t){throw d("Failed to export data:",t,"error"),t}}async function Zi(){let t=ji.array().safeParse((await ii()).filter(u=>!u.deleted_at));if(!t.success||t.data.length===0){t.success||d("Failed to parse timestamp rows for CSV export:",t.error.format(),"warn");let u=`Tag,Timestamp,URL
`,g=`timestamps-${or()}.csv`;return{csv:u,filename:g,totalVideos:0,totalTimestamps:0}}let e=t.data,n=new Map;for(let u of e)n.has(u.video_id)||n.set(u.video_id,[]),n.get(u.video_id).push({start:u.start,comment:u.comment});let r=[];r.push("Tag,Timestamp,URL");let i=0,o=u=>`"${String(u).replace(/"/g,'""')}"`,s=u=>{let g=Math.floor(u/3600),y=Math.floor(u%3600/60),_=String(u%60).padStart(2,"0");return`${String(g).padStart(2,"0")}:${String(y).padStart(2,"0")}:${_}`},a=Array.from(n.keys()).sort();for(let u of a){let g=n.get(u).sort((y,_)=>y.start-_.start);for(let y of g){let _=y.comment,P=s(y.start),V=$i(y.start,`https://www.youtube.com/watch?v=${u}`);r.push([o(_),o(P),o(V)].join(",")),i++}}let p=r.join(`
`),c=`timestamps-${or()}.csv`;return{csv:p,filename:c,totalVideos:n.size,totalTimestamps:i}}async function Al(){try{let{csv:t,filename:e,totalVideos:n,totalTimestamps:r}=await Zi(),i=new Blob([t],{type:"text/csv;charset=utf-8;"}),o=URL.createObjectURL(i),s=document.createElement("a");s.href=o,s.download=e,s.click(),URL.revokeObjectURL(o),d(`Exported ${n} videos with ${r} timestamps (CSV)`)}catch(t){throw d("Failed to export CSV data:",t,"error"),t}}async function Wi(t,e){if(!t)throw new Error("Video ID is required");if(!e.guid||e.start==null)throw new Error("Timestamp must have GUID and start time");return bl(t,e)}async function Ml(t,e){if(!t)throw new Error("Video ID is required");if(!Array.isArray(e))throw new Error("Timestamps must be an array");return yl(t,e)}async function Bl(t){if(!t)throw new Error("GUID is required");return wl(t)}async function Ll(t){if(!t)throw new Error("Video ID is required");return Tl(t)}async function Il(t){if(!t)throw new Error("Video ID is required");return xl(t)}async function Cl(t){let e;try{e=JSON.parse(t)}catch{return d("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=gl.safeParse(e);if(!n.success)return d("mergeBackupData: data failed validation",n.error.format(),"warn"),{mergedVideos:0,mergedTimestamps:0};let r=await ii(),i=new Map;for(let p of r)i.set(p.guid,p);let o=0,s=0,a=[];for(let[,p]of Object.entries(n.data)){let{video_id:c,timestamps:u}=p,g=0;for(let y of u){let _=i.get(y.guid),P=!1;_?_.write_counter!==void 0&&y.write_counter!==void 0&&y.write_counter>_.write_counter&&(P=!0):P=!0,P&&(a.push({guid:y.guid,video_id:c,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),i.set(y.guid,{..._??{},guid:y.guid,video_id:c,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),g++,s++)}g>0&&o++}return await kl(a),{mergedVideos:o,mergedTimestamps:s}}function Dl(t,e){if(!t)throw new Error("Setting key is required");return Sl(t,e)}async function Rl(t){if(!t)throw new Error("Setting key is required");return El(t)}function Op(t,e){return Wi(t,e)}function Np(t,e){return Ml(t,e)}function zp(t,e){return Wi(t,e)}function Hp(t){return Il(t)}function $p(t,e){return Bl(e)}function Fp(t){return Ll(t)}function ai(t,e){Dl(t,e)}function si(t){return Rl(t)}function jp(t){return qi(t)}function Vp(){return _l()}function Gp(){return Zi()}function Up(){return Al()}function qp(t){return Cl(t)}var Zp=!1,Wp=null;function li(t){return t?Array.from(t.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function ci(t){if(!t)return;t.replaceChildren(),Wp=null;let e=t.querySelector(".ytls-error-message");e&&e.remove()}function Yi(t,e){if(!t)return;ci(t);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=e,t.appendChild(n),t.style.overflowY="hidden"}function Pl(t){if(!t)return;let e=t.querySelector(".ytls-placeholder");e&&e.remove(),t.style.overflowY=""}function mo(t){return t?t.querySelector(".ytls-error-message")!==null:!1}function Ol(t,e){if(!t)return;ci(t);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
    color: #ff4d4f;
    text-align: center;
    padding: 16px;
    background: rgba(255, 0, 0, 0.08);
    border: 1px solid rgba(255, 77, 79, 0.3);
    border-radius: 6px;
    margin: 8px;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.5;
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${Kp(e)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,t.appendChild(n),t.style.overflowY="hidden"}function Nl(t){if(!t)return;let e=t.querySelector(".ytls-error-message");e&&e.remove()}function Kp(t){let e=document.createElement("div");return e.textContent=t,e.innerHTML}function zl(t,e){if(!t||e||mo(t))return;Array.from(t.children).some(r=>!r.classList.contains("ytls-placeholder")&&!r.classList.contains("ytls-error-message"))||Yi(t,"No timestamps for this video")}function Hl(t){if(!t)return[];let e=li(t),n=[];return e.forEach(r=>{let i=r.querySelector("[data-time]"),o=r.querySelector("input"),s=r.dataset.guid;if(!i||!o||!s)return;let a=i.dataset.time;if(!a)return;let p=Number.parseInt(a,10);Number.isFinite(p)&&n.push({guid:s,start:p,comment:o.value})}),n.sort((r,i)=>r.start-i.start)}function fo(t){Zp=t}function $l(t){if(!t)return 0;let e=li(t),n=0;return e.forEach(r=>{let o=r.querySelector("[data-time]")?.dataset.time;if(o){let s=Number.parseInt(o,10);Number.isFinite(s)&&(n=Math.max(n,s))}}),n}var Jp={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1,timekeeperBackendBackupEnabled:!1,timekeeperBackendHost:"localhost",timekeeperBackendPort:8443,timekeeperBackendBearerToken:null},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},Ye=JSON.parse(JSON.stringify(Jp)),Fl=new Set;function _e(){return Ye}function ho(t){let e=Fl.size>0?JSON.parse(JSON.stringify(Ye)):Ye;Ye={...Ye,...t,auth:{...Ye.auth,...t.auth||{}},ui:{...Ye.ui,...t.ui||{}},timestamps:{...Ye.timestamps,...t.timestamps||{}}},Xp(e)}function Rt(t,e){ho({auth:{...Ye.auth,[t]:e}})}function ui(t,e){ho({ui:{...Ye.ui,[t]:e}})}function Wt(){return Ye.auth.googleAuthState}function Pt(t){Rt("googleAuthState",t)}function Ji(t){Rt("autoBackupEnabled",t)}function Xi(t){Rt("autoBackupIntervalMinutes",t)}function Qi(t){Rt("isAutoBackupRunning",t)}function di(t){Rt("autoBackupRetryAttempts",t)}function $r(t){Rt("autoBackupBackoffMs",t)}function ea(t){Rt("lastAutoBackupAt",t)}function ta(t){Rt("timekeeperBackendBackupEnabled",t)}function na(t){Rt("timekeeperBackendHost",t)}function ra(t){Rt("timekeeperBackendPort",t)}function oa(t){Rt("timekeeperBackendBearerToken",t)}function jl(t){ui("minPaneHeight",t)}function Vl(t){ui("panePosition",t)}function Gl(t){ui("lastHandledUrl",t)}function Ul(t){ui("urlChangeHandlersSetup",t)}function ql(t){ho({timestamps:{...Ye.timestamps,items:t}})}function Zl(t){ho({timestamps:{...Ye.timestamps,currentIndex:t}})}function ia(t){ho({timestamps:{...Ye.timestamps,dbError:t}})}function Wl(){return Ye.timestamps.dbError}function Xp(t){Fl.forEach(e=>{try{e(Ye,t)}catch(n){console.error("Error in state listener:",n)}})}var tc=43200*14,Yl="html5_max_live_dvr_window_plus_margin_secs";function un(t){return t!=null&&typeof t=="object"}function Jl(t){let{streamingData:e,videoDetails:n,playerConfig:r,microformat:i}=t;if(!(!un(n)||!n.isLive)){if(n.isLiveDvrEnabled=!0,un(r)){let o=r.mediaCommonConfig;if(un(o)){o.useServerDrivenAbr=!1;let s=o.serverPlaybackStartConfig;un(s)&&(s.enable=!1)}}if(un(e)){let o=e;if(o.serverAbrStreamingUrl&&(o.hlsManifestUrl||o.dashManifestUrl)&&delete o.serverAbrStreamingUrl,Array.isArray(o.adaptiveFormats)&&Qp(i))for(let s of o.adaptiveFormats)s.maxDvrDurationSec=tc}}}function Qp(t){if(!un(t))return!1;let e=t.playerMicroformatRenderer;if(!un(e))return!1;let n=e.liveBroadcastDetails;if(!un(n))return!1;let r=n.startTimestamp;return!r||typeof r!="string"?!1:(Date.now()-new Date(r).getTime())/1e3>43200}function aa(t){if(!t||typeof t!="object")return!1;let e=t;return e.videoDetails?(Jl(e),!0):e.playerResponse&&un(e.playerResponse)&&e.playerResponse.videoDetails?(Jl(e.playerResponse),!0):!1}function em(){let t=Object.getOwnPropertyDescriptor(window,"ytInitialPlayerResponse"),e=t&&t.set,n=window.ytInitialPlayerResponse;if(!aa(n))try{Object.defineProperty(window,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(r){e&&e.call(this,r),n=r,aa(r)&&Object.defineProperty(window,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:r})}})}catch{}}var Xl=!1;function tm(){if(Xl)return;Xl=!0;let t=JSON.parse;JSON.parse=function(e,n){let r=t.call(this,e,n);try{aa(r)}catch{}return r}}function Ql(t){if(t.__dvrCapLifted)return;let n=(typeof t.d=="function"?t.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let r=n;for(let i in r){let o=r[i];if(o&&typeof o.serializedExperimentFlags=="string"){let s=o.serializedExperimentFlags,a=s.replace(new RegExp(`${Yl}=[\\d.]+`),`${Yl}=${tc}`);a!==s&&(o.serializedExperimentFlags=a)}}t.__dvrCapLifted=!0}function ec(t){if(!t||t.__dvrHooked)return t;t.__dvrHooked=!0;let e=t.set;typeof e=="function"&&(t.set=function(...n){let r=e.apply(this,n);try{Ql(t)}catch{}return r});try{Ql(t)}catch{}return t}function nm(){let t={};window.ytcfg&&(t=ec(window.ytcfg));try{Object.defineProperty(window,"ytcfg",{configurable:!0,get(){return t},set(e){t=ec(e)}})}catch{}}function nc(){em(),tm(),nm(),d("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var Te=Uint8Array,ht=Uint16Array,va=Int32Array,pi=new Te([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),mi=new Te([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),da=new Te([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),cc=function(t,e){for(var n=new ht(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new va(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},uc=cc(pi,2),dc=uc.b,pa=uc.r;dc[28]=258,pa[258]=28;var pc=cc(mi,0),rm=pc.b,rc=pc.r,ma=new ht(32768);for(se=0;se<32768;++se)dn=(se&43690)>>1|(se&21845)<<1,dn=(dn&52428)>>2|(dn&13107)<<2,dn=(dn&61680)>>4|(dn&3855)<<4,ma[se]=((dn&65280)>>8|(dn&255)<<8)>>1;var dn,se,Yt=(function(t,e,n){for(var r=t.length,i=0,o=new ht(e);i<r;++i)t[i]&&++o[t[i]-1];var s=new ht(e);for(i=1;i<e;++i)s[i]=s[i-1]+o[i-1]<<1;var a;if(n){a=new ht(1<<e);var p=15-e;for(i=0;i<r;++i)if(t[i])for(var c=i<<4|t[i],u=e-t[i],g=s[t[i]-1]++<<u,y=g|(1<<u)-1;g<=y;++g)a[ma[g]>>p]=c}else for(a=new ht(r),i=0;i<r;++i)t[i]&&(a[i]=ma[s[t[i]-1]++]>>15-t[i]);return a}),Cn=new Te(288);for(se=0;se<144;++se)Cn[se]=8;var se;for(se=144;se<256;++se)Cn[se]=9;var se;for(se=256;se<280;++se)Cn[se]=7;var se;for(se=280;se<288;++se)Cn[se]=8;var se,yo=new Te(32);for(se=0;se<32;++se)yo[se]=5;var se,om=Yt(Cn,9,0),im=Yt(Cn,9,1),am=Yt(yo,5,0),sm=Yt(yo,5,1),sa=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},Ot=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},la=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},ya=function(t){return(t+7)/8|0},bo=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new Te(t.subarray(e,n))};var lm=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],nt=function(t,e,n){var r=new Error(e||lm[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,nt),!n)throw r;return r},cm=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new Te(0);var s=!n,a=s||e.i!=2,p=e.i;s&&(n=new Te(i*3));var c=function(gn){var Dn=n.length;if(gn>Dn){var vn=new Te(Math.max(Dn*2,gn));vn.set(n),n=vn}},u=e.f||0,g=e.p||0,y=e.b||0,_=e.l,P=e.d,V=e.m,$=e.n,X=i*8;do{if(!_){u=Ot(t,g,1);var C=Ot(t,g+1,3);if(g+=3,C)if(C==1)_=im,P=sm,V=9,$=5;else if(C==2){var Ae=Ot(t,g,31)+257,ye=Ot(t,g+10,15)+4,Y=Ae+Ot(t,g+5,31)+1;g+=14;for(var W=new Te(Y),Me=new Te(19),Ce=0;Ce<ye;++Ce)Me[da[Ce]]=Ot(t,g+Ce*3,7);g+=ye*3;for(var $e=sa(Me),ot=(1<<$e)-1,Fe=Yt(Me,$e,1),Ce=0;Ce<Y;){var De=Fe[Ot(t,g,ot)];g+=De&15;var R=De>>4;if(R<16)W[Ce++]=R;else{var Be=0,be=0;for(R==16?(be=3+Ot(t,g,3),g+=2,Be=W[Ce-1]):R==17?(be=3+Ot(t,g,7),g+=3):R==18&&(be=11+Ot(t,g,127),g+=7);be--;)W[Ce++]=Be}}var Ue=W.subarray(0,Ae),Oe=W.subarray(Ae);V=sa(Ue),$=sa(Oe),_=Yt(Ue,V,1),P=Yt(Oe,$,1)}else nt(1);else{var R=ya(g)+4,ie=t[R-4]|t[R-3]<<8,de=R+ie;if(de>i){p&&nt(0);break}a&&c(y+ie),n.set(t.subarray(R,de),y),e.b=y+=ie,e.p=g=de*8,e.f=u;continue}if(g>X){p&&nt(0);break}}a&&c(y+131072);for(var hn=(1<<V)-1,it=(1<<$)-1,at=g;;at=g){var Be=_[la(t,g)&hn],Re=Be>>4;if(g+=Be&15,g>X){p&&nt(0);break}if(Be||nt(2),Re<256)n[y++]=Re;else if(Re==256){at=g,_=null;break}else{var ke=Re-254;if(Re>264){var Ce=Re-257,le=pi[Ce];ke=Ot(t,g,(1<<le)-1)+dc[Ce],g+=le}var Pe=P[la(t,g)&it],Tt=Pe>>4;Pe||nt(3),g+=Pe&15;var Oe=rm[Tt];if(Tt>3){var le=mi[Tt];Oe+=la(t,g)&(1<<le)-1,g+=le}if(g>X){p&&nt(0);break}a&&c(y+131072);var Xt=y+ke;if(y<Oe){var ur=o-Oe,dr=Math.min(Oe,Xt);for(ur+y<0&&nt(3);y<dr;++y)n[y]=r[ur+y]}for(;y<Xt;++y)n[y]=n[y-Oe]}}e.l=_,e.p=at,e.b=y,e.f=u,_&&(u=1,e.m=V,e.d=P,e.n=$)}while(!u);return y!=n.length&&s?bo(n,0,y):n.subarray(0,y)},pn=function(t,e,n){n<<=e&7;var r=e/8|0;t[r]|=n,t[r+1]|=n>>8},go=function(t,e,n){n<<=e&7;var r=e/8|0;t[r]|=n,t[r+1]|=n>>8,t[r+2]|=n>>16},ca=function(t,e){for(var n=[],r=0;r<t.length;++r)t[r]&&n.push({s:r,f:t[r]});var i=n.length,o=n.slice();if(!i)return{t:fc,l:0};if(i==1){var s=new Te(n[0].s+1);return s[n[0].s]=1,{t:s,l:1}}n.sort(function(de,Ae){return de.f-Ae.f}),n.push({s:-1,f:25001});var a=n[0],p=n[1],c=0,u=1,g=2;for(n[0]={s:-1,f:a.f+p.f,l:a,r:p};u!=i-1;)a=n[n[c].f<n[g].f?c++:g++],p=n[c!=u&&n[c].f<n[g].f?c++:g++],n[u++]={s:-1,f:a.f+p.f,l:a,r:p};for(var y=o[0].s,r=1;r<i;++r)o[r].s>y&&(y=o[r].s);var _=new ht(y+1),P=fa(n[u-1],_,0);if(P>e){var r=0,V=0,$=P-e,X=1<<$;for(o.sort(function(Ae,ye){return _[ye.s]-_[Ae.s]||Ae.f-ye.f});r<i;++r){var C=o[r].s;if(_[C]>e)V+=X-(1<<P-_[C]),_[C]=e;else break}for(V>>=$;V>0;){var R=o[r].s;_[R]<e?V-=1<<e-_[R]++-1:++r}for(;r>=0&&V;--r){var ie=o[r].s;_[ie]==e&&(--_[ie],++V)}P=e}return{t:new Te(_),l:P}},fa=function(t,e,n){return t.s==-1?Math.max(fa(t.l,e,n+1),fa(t.r,e,n+1)):e[t.s]=n},oc=function(t){for(var e=t.length;e&&!t[--e];);for(var n=new ht(++e),r=0,i=t[0],o=1,s=function(p){n[r++]=p},a=1;a<=e;++a)if(t[a]==i&&a!=e)++o;else{if(!i&&o>2){for(;o>138;o-=138)s(32754);o>2&&(s(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(s(i),--o;o>6;o-=6)s(8304);o>2&&(s(o-3<<5|8208),o=0)}for(;o--;)s(i);o=1,i=t[a]}return{c:n.subarray(0,r),n:e}},vo=function(t,e){for(var n=0,r=0;r<e.length;++r)n+=t[r]*e[r];return n},mc=function(t,e,n){var r=n.length,i=ya(e+2);t[i]=r&255,t[i+1]=r>>8,t[i+2]=t[i]^255,t[i+3]=t[i+1]^255;for(var o=0;o<r;++o)t[i+o+4]=n[o];return(i+4+r)*8},ic=function(t,e,n,r,i,o,s,a,p,c,u){pn(e,u++,n),++i[256];for(var g=ca(i,15),y=g.t,_=g.l,P=ca(o,15),V=P.t,$=P.l,X=oc(y),C=X.c,R=X.n,ie=oc(V),de=ie.c,Ae=ie.n,ye=new ht(19),Y=0;Y<C.length;++Y)++ye[C[Y]&31];for(var Y=0;Y<de.length;++Y)++ye[de[Y]&31];for(var W=ca(ye,7),Me=W.t,Ce=W.l,$e=19;$e>4&&!Me[da[$e-1]];--$e);var ot=c+5<<3,Fe=vo(i,Cn)+vo(o,yo)+s,De=vo(i,y)+vo(o,V)+s+14+3*$e+vo(ye,Me)+2*ye[16]+3*ye[17]+7*ye[18];if(p>=0&&ot<=Fe&&ot<=De)return mc(e,u,t.subarray(p,p+c));var Be,be,Ue,Oe;if(pn(e,u,1+(De<Fe)),u+=2,De<Fe){Be=Yt(y,_,0),be=y,Ue=Yt(V,$,0),Oe=V;var hn=Yt(Me,Ce,0);pn(e,u,R-257),pn(e,u+5,Ae-1),pn(e,u+10,$e-4),u+=14;for(var Y=0;Y<$e;++Y)pn(e,u+3*Y,Me[da[Y]]);u+=3*$e;for(var it=[C,de],at=0;at<2;++at)for(var Re=it[at],Y=0;Y<Re.length;++Y){var ke=Re[Y]&31;pn(e,u,hn[ke]),u+=Me[ke],ke>15&&(pn(e,u,Re[Y]>>5&127),u+=Re[Y]>>12)}}else Be=om,be=Cn,Ue=am,Oe=yo;for(var Y=0;Y<a;++Y){var le=r[Y];if(le>255){var ke=le>>18&31;go(e,u,Be[ke+257]),u+=be[ke+257],ke>7&&(pn(e,u,le>>23&31),u+=pi[ke]);var Pe=le&31;go(e,u,Ue[Pe]),u+=Oe[Pe],Pe>3&&(go(e,u,le>>5&8191),u+=mi[Pe])}else go(e,u,Be[le]),u+=be[le]}return go(e,u,Be[256]),u+be[256]},um=new va([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),fc=new Te(0),dm=function(t,e,n,r,i,o){var s=o.z||t.length,a=new Te(r+s+5*(1+Math.ceil(s/7e3))+i),p=a.subarray(r,a.length-i),c=o.l,u=(o.r||0)&7;if(e){u&&(p[0]=o.r>>3);for(var g=um[e-1],y=g>>13,_=g&8191,P=(1<<n)-1,V=o.p||new ht(32768),$=o.h||new ht(P+1),X=Math.ceil(n/3),C=2*X,R=function(pr){return(t[pr]^t[pr+1]<<X^t[pr+2]<<C)&P},ie=new va(25e3),de=new ht(288),Ae=new ht(32),ye=0,Y=0,W=o.i||0,Me=0,Ce=o.w||0,$e=0;W+2<s;++W){var ot=R(W),Fe=W&32767,De=$[ot];if(V[Fe]=De,$[ot]=Fe,Ce<=W){var Be=s-W;if((ye>7e3||Me>24576)&&(Be>423||!c)){u=ic(t,p,0,ie,de,Ae,Y,Me,$e,W-$e,u),Me=ye=Y=0,$e=W;for(var be=0;be<286;++be)de[be]=0;for(var be=0;be<30;++be)Ae[be]=0}var Ue=2,Oe=0,hn=_,it=Fe-De&32767;if(Be>2&&ot==R(W-it))for(var at=Math.min(y,Be)-1,Re=Math.min(32767,W),ke=Math.min(258,Be);it<=Re&&--hn&&Fe!=De;){if(t[W+Ue]==t[W+Ue-it]){for(var le=0;le<ke&&t[W+le]==t[W+le-it];++le);if(le>Ue){if(Ue=le,Oe=it,le>at)break;for(var Pe=Math.min(it,le-2),Tt=0,be=0;be<Pe;++be){var Xt=W-it+be&32767,ur=V[Xt],dr=Xt-ur&32767;dr>Tt&&(Tt=dr,De=Xt)}}}Fe=De,De=V[Fe],it+=Fe-De&32767}if(Oe){ie[Me++]=268435456|pa[Ue]<<18|rc[Oe];var gn=pa[Ue]&31,Dn=rc[Oe]&31;Y+=pi[gn]+mi[Dn],++de[257+gn],++Ae[Dn],Ce=W+Ue,++ye}else ie[Me++]=t[W],++de[t[W]]}}for(W=Math.max(W,Ce);W<s;++W)ie[Me++]=t[W],++de[t[W]];u=ic(t,p,c,ie,de,Ae,Y,Me,$e,W-$e,u),c||(o.r=u&7|p[u/8|0]<<3,u-=7,o.h=$,o.p=V,o.i=W,o.w=Ce)}else{for(var W=o.w||0;W<s+c;W+=65535){var vn=W+65535;vn>=s&&(p[u/8|0]=c,vn=s),u=mc(p,u+1,t.subarray(W,vn))}o.i=s}return bo(a,0,r+ya(u)+i)},pm=(function(){for(var t=new Int32Array(256),e=0;e<256;++e){for(var n=e,r=9;--r;)n=(n&1&&-306674912)^n>>>1;t[e]=n}return t})(),mm=function(){var t=-1;return{p:function(e){for(var n=t,r=0;r<e.length;++r)n=pm[n&255^e[r]]^n>>>8;t=n},d:function(){return~t}}};var fm=function(t,e,n,r,i){if(!i&&(i={l:1},e.dictionary)){var o=e.dictionary.subarray(-32768),s=new Te(o.length+t.length);s.set(o),s.set(t,o.length),t=s,i.w=o.length}return dm(t,e.level==null?6:e.level,e.mem==null?i.l?Math.ceil(Math.max(8,Math.min(13,Math.log(t.length)))*1.5):20:12+e.mem,n,r,i)},hc=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n};var Kt=function(t,e){return t[e]|t[e+1]<<8},Nt=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},ua=function(t,e){return Nt(t,e)+Nt(t,e+4)*4294967296},Ge=function(t,e,n){for(;n;++e)t[e]=n,n>>>=8};function hm(t,e){return fm(t,e||{},0,0)}function gm(t,e){return cm(t,{i:2},e&&e.out,e&&e.dictionary)}var gc=function(t,e,n,r){for(var i in t){var o=t[i],s=e+i,a=r;Array.isArray(o)&&(a=hc(r,o[1]),o=o[0]),o instanceof Te?n[s]=[o,a]:(n[s+="/"]=[new Te(0),a],gc(o,s,n,r))}},ac=typeof TextEncoder<"u"&&new TextEncoder,ha=typeof TextDecoder<"u"&&new TextDecoder,vm=0;try{ha.decode(fc,{stream:!0}),vm=1}catch{}var ym=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:bo(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function sc(t,e){if(e){for(var n=new Te(t.length),r=0;r<t.length;++r)n[r]=t.charCodeAt(r);return n}if(ac)return ac.encode(t);for(var i=t.length,o=new Te(t.length+(t.length>>1)),s=0,a=function(u){o[s++]=u},r=0;r<i;++r){if(s+5>o.length){var p=new Te(s+8+(i-r<<1));p.set(o),o=p}var c=t.charCodeAt(r);c<128||e?a(c):c<2048?(a(192|c>>6),a(128|c&63)):c>55295&&c<57344?(c=65536+(c&1047552)|t.charCodeAt(++r)&1023,a(240|c>>18),a(128|c>>12&63),a(128|c>>6&63),a(128|c&63)):(a(224|c>>12),a(128|c>>6&63),a(128|c&63))}return bo(o,0,s)}function bm(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(ha)return ha.decode(t);var i=ym(t),o=i.s,n=i.r;return n.length&&nt(8),o}}var km=function(t,e){return e+30+Kt(t,e+26)+Kt(t,e+28)},wm=function(t,e,n){var r=Kt(t,e+28),i=bm(t.subarray(e+46,e+46+r),!(Kt(t,e+8)&2048)),o=e+46+r,s=Nt(t,e+20),a=n&&s==4294967295?xm(t,o):[s,Nt(t,e+24),Nt(t,e+42)],p=a[0],c=a[1],u=a[2];return[Kt(t,e+10),p,c,i,o+Kt(t,e+30)+Kt(t,e+32),u]},xm=function(t,e){for(;Kt(t,e)!=1;e+=4+Kt(t,e+2));return[ua(t,e+12),ua(t,e+4),ua(t,e+20)]},ga=function(t){var e=0;if(t)for(var n in t){var r=t[n].length;r>65535&&nt(9),e+=r+4}return e},lc=function(t,e,n,r,i,o,s,a){var p=r.length,c=n.extra,u=a&&a.length,g=ga(c);Ge(t,e,s!=null?33639248:67324752),e+=4,s!=null&&(t[e++]=20,t[e++]=n.os),t[e]=20,e+=2,t[e++]=n.flag<<1|(o<0&&8),t[e++]=i&&8,t[e++]=n.compression&255,t[e++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),_=y.getFullYear()-1980;if((_<0||_>119)&&nt(10),Ge(t,e,_<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),e+=4,o!=-1&&(Ge(t,e,n.crc),Ge(t,e+4,o<0?-o-2:o),Ge(t,e+8,n.size)),Ge(t,e+12,p),Ge(t,e+14,g),e+=16,s!=null&&(Ge(t,e,u),Ge(t,e+6,n.attrs),Ge(t,e+10,s),e+=14),t.set(r,e),e+=p,g)for(var P in c){var V=c[P],$=V.length;Ge(t,e,+P),Ge(t,e+2,$),t.set(V,e+4),e+=4+$}return u&&(t.set(a,e),e+=u),e},Tm=function(t,e,n,r,i){Ge(t,e,101010256),Ge(t,e+8,n),Ge(t,e+10,n),Ge(t,e+12,r),Ge(t,e+16,i)};function vc(t,e){e||(e={});var n={},r=[];gc(t,"",n,e);var i=0,o=0;for(var s in n){var a=n[s],p=a[0],c=a[1],u=c.level==0?0:8,g=sc(s),y=g.length,_=c.comment,P=_&&sc(_),V=P&&P.length,$=ga(c.extra);y>65535&&nt(11);var X=u?hm(p,c):p,C=X.length,R=mm();R.p(p),r.push(hc(c,{size:p.length,crc:R.d(),c:X,f:g,m:P,u:y!=s.length||P&&_.length!=V,o:i,compression:u})),i+=30+y+$+C,o+=76+2*(y+$)+(V||0)+C}for(var ie=new Te(o+22),de=i,Ae=o-i,ye=0;ye<r.length;++ye){var g=r[ye];lc(ie,g.o,g,g.f,g.u,g.c.length);var Y=30+g.f.length+ga(g.extra);ie.set(g.c,g.o+Y),lc(ie,i,g,g.f,g.u,g.c.length,g.o,g.m),i+=16+Y+(g.m?g.m.length:0)}return Tm(ie,i,r.length,Ae,de),ie}function yc(t,e){for(var n={},r=t.length-22;Nt(t,r)!=101010256;--r)(!r||t.length-r>65558)&&nt(13);var i=Kt(t,r+8);if(!i)return{};var o=Nt(t,r+16),s=o==4294967295||i==65535;if(s){var a=Nt(t,r-12);s=Nt(t,a)==101075792,s&&(i=Nt(t,a+32),o=Nt(t,a+48))}for(var p=e&&e.filter,c=0;c<i;++c){var u=wm(t,o,s),g=u[0],y=u[1],_=u[2],P=u[3],V=u[4],$=u[5],X=km(t,$);o=V,(!p||p({name:P,size:y,originalSize:_,compression:g}))&&(g?g==8?n[P]=gm(t.subarray(X,X+y),{out:new Te(_)}):nt(14,"unknown compression type "+g):n[P]=bo(t,X,X+y))}return n}function zt(){return Wt()}var wt={get isSignedIn(){return Wt().isSignedIn},get accessToken(){return Wt().accessToken},get userName(){return Wt().userName},get email(){return Wt().email},set isSignedIn(t){let e=Wt();Pt({...e,isSignedIn:t})},set accessToken(t){let e=Wt();Pt({...e,accessToken:t})},set userName(t){let e=Wt();Pt({...e,userName:t})},set email(t){let e=Wt();Pt({...e,email:t})}};function wo(){return _e().auth.autoBackupEnabled}function Jt(){return _e().auth.autoBackupIntervalMinutes}function Ur(){return _e().auth.timekeeperBackendBackupEnabled}function gi(){return _e().auth.timekeeperBackendHost}function lr(){return _e().auth.timekeeperBackendPort}function vi(){return _e().auth.timekeeperBackendBearerToken}var wa=null,ve=null,me=null,sr=null;function wc(t){wa=t}function xc(t){ve=t}function Tc(t){me=t}function Sc(t){sr=t}var bc=!1;function Ec(){if(!bc)try{let t=document.createElement("style");t.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(t),bc=!0}catch{}}var _c=null,xa=null,mn=null,fn=null,Ta=null;function Ac(t){_c=t}function Mc(t){xa=t}function Sa(t){mn=t}function Ea(t){fn=t}function Bc(t){Ta=t}var hi="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",Lc="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",Ic="https://www.youtube.com/",Sm="localhost";var Em=new Date(Date.UTC(2e3,0,1,0,0,0)),_m=30*1e3,Am=1800*1e3,kc=5,fi=null,rt=null;async function _a(){try{let t=await fn("googleAuthState"),e=t&&typeof t=="object"?{...t,accessToken:t.accessToken?"[REDACTED]":null}:t;d("Loading Google auth state from IndexedDB:",e);let n=Vi.safeParse(t);if(n.success){let r=zt();Pt({...r,...n.data});let i=zt();i.isSignedIn&&i.accessToken&&d(`Reusing stored Google auth token for ${i.userName||i.email||"user"}`),qr();let o=zt();o.isSignedIn&&o.accessToken&&await xt(!0)}else if(t!==void 0){let r=t&&typeof t=="object"?{...t,accessToken:t.accessToken?"[REDACTED]":null}:t;d("Google auth state failed validation:",{stored:r,errors:n.error.format()},"warn")}}catch(t){d("Failed to load Google auth state:",t,"error")}}async function xo(){try{let t=zt(),e=Vi.safeParse(t);if(!e.success){let n={...t,accessToken:t.accessToken?"[REDACTED]":null};d("Invalid auth state, cannot save",{state:n,errors:e.error.format()},"error");return}await mn("googleAuthState",t),t.isSignedIn&&t.accessToken?d(`Saved Google auth state to IndexedDB for ${t.userName||t.email||"user"}`):d("Cleared Google auth state in IndexedDB (signed out)")}catch(t){d("Failed to save Google auth state:",t,"error")}}function qr(){wa&&(wa.style.display="none")}function mt(t,e){if(!me)return;if(me.style.fontWeight="bold",t==="authenticating"){Ec(),me.style.color="#ffa500",me.replaceChildren();let r=document.createElement("span");r.className="tk-auth-spinner";let i=document.createTextNode(` ${e||"Authorizing with Google\u2026"}`);me.appendChild(r),me.appendChild(i);return}if(t==="error"){ce(me,"circle-x",e||"Authorization failed"),me.style.color="#ff4d4f",xe();return}let n=zt();n.isSignedIn?(ce(me,"circle-check","Signed in"),me.style.color="#52c41a",me.removeAttribute("title"),n.userName?(me.onmouseenter=()=>{ce(me,"circle-check",`Signed in as ${n.userName}`)},me.onmouseleave=()=>{ce(me,"circle-check","Signed in")}):(me.onmouseenter=null,me.onmouseleave=null)):(ce(me,"circle-x","Not signed in"),me.style.color="#ff4d4f",me.removeAttribute("title"),me.onmouseenter=null,me.onmouseleave=null),xe()}function Mm(){me&&(Ec(),me.classList.remove("tk-auth-blink"),me.offsetWidth,me.classList.add("tk-auth-blink"),setTimeout(()=>{me.classList.remove("tk-auth-blink")},1200))}function Cc(t,e=300*1e3){return new Promise((n,r)=>{if(!t){d&&d("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}d&&d("OAuth monitor: starting to monitor popup for token");let i=Date.now(),o="timekeeper_oauth",s=null,a=null,p=null,c=()=>{if(s){try{s.close()}catch{}s=null}a&&(clearInterval(a),a=null),p&&(clearInterval(p),p=null)};try{s=new BroadcastChannel(o),d&&d("OAuth monitor: BroadcastChannel created successfully"),s.onmessage=y=>{let _=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;d&&d("OAuth monitor: received BroadcastChannel message",_);let P=z.object({type:z.string(),token:z.string().optional(),error:z.string().optional()}).safeParse(y.data);if(!P.success){d&&d("OAuth monitor: invalid message format",P.error,"warn");return}if(P.data.type==="timekeeper_oauth_token"&&P.data.token){d&&d("OAuth monitor: token received via BroadcastChannel"),c();try{t.close()}catch{}n(P.data.token)}else if(P.data.type==="timekeeper_oauth_error"){d&&d("OAuth monitor: error received via BroadcastChannel",P.data.error,"error"),c();try{t.close()}catch{}r(new Error(P.data.error||"OAuth failed"))}}}catch(y){d&&d("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}d&&d("OAuth monitor: setting up IndexedDB polling");let u=Date.now();a=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let _=y.result,$=_.transaction("settings","readonly").objectStore("settings").get("oauth_message");$.onsuccess=()=>{let X=$.result;if(X&&X.value){let C=X.value,R=z.object({type:z.string(),token:z.string().optional(),error:z.string().optional(),timestamp:z.number().optional()}).safeParse(C);if(!R.success){d&&d("OAuth monitor: invalid IndexedDB message format",R.error,"warn");return}if(R.data.timestamp&&R.data.timestamp>u){let ie=R.data.token?{...R.data,token:"[REDACTED]"}:R.data;if(d&&d("OAuth monitor: received IndexedDB message",ie),R.data.type==="timekeeper_oauth_token"&&R.data.token){d&&d("OAuth monitor: token received via IndexedDB"),c();try{t.close()}catch{}_.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(R.data.token)}else if(R.data.type==="timekeeper_oauth_error"){d&&d("OAuth monitor: error received via IndexedDB",R.data.error,"error"),c();try{t.close()}catch{}_.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(R.data.error||"OAuth failed"))}u=R.data.timestamp||Date.now()}}_.close()}}}catch(y){d&&d("OAuth monitor: IndexedDB polling error",y,"error")}},500),p=setInterval(()=>{if(Date.now()-i>e){d&&d("OAuth monitor: popup timed out after 5 minutes",null,"error"),c();try{t.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function Dc(){if(!hi){mt("error","Google Client ID not configured");return}try{d&&d("OAuth signin: starting OAuth flow"),mt("authenticating","Opening authentication window...");let t=new URL("https://accounts.google.com/o/oauth2/v2/auth");t.searchParams.set("client_id",hi),t.searchParams.set("redirect_uri",Ic),t.searchParams.set("response_type","token"),t.searchParams.set("scope",Lc),t.searchParams.set("include_granted_scopes","true"),t.searchParams.set("state","timekeeper_auth"),d&&d("OAuth signin: opening popup");let e=window.open(t.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!e){d&&d("OAuth signin: popup blocked by browser",null,"error"),mt("error","Popup blocked. Please enable popups for YouTube.");return}d&&d("OAuth signin: popup opened successfully"),mt("authenticating","Waiting for authentication...");try{let n=await Cc(e),r=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(r.ok){let i=await r.json(),o=z.object({name:z.string().optional(),email:z.string().optional()}).safeParse(i);if(!o.success)throw d&&d("Failed to validate user info response",o.error,"error"),new Error("Invalid user info response");let s=o.data;Pt({isSignedIn:!0,accessToken:n,userName:s.name||null,email:s.email||null}),await xo(),qr(),mt(),xe(),await xt(),d?d(`Successfully authenticated as ${s.name}`):console.log(`[Timekeeper] Successfully authenticated as ${s.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let r=n instanceof Error?n.message:"Authentication failed";d?d("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),mt("error",r);return}}catch(t){let e=t instanceof Error?t.message:"Sign in failed";d?d("Failed to sign in to Google:",t,"error"):console.error("[Timekeeper] Failed to sign in to Google:",t),mt("error",`Failed to sign in: ${e}`)}}async function Bm(){let t=zt(),e=t.email;if(!hi||!e)return!1;d("Silent OAuth: attempting silent token refresh for "+e);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",hi),n.searchParams.set("redirect_uri",Ic),n.searchParams.set("response_type","token"),n.searchParams.set("scope",Lc),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",e);let r=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!r)return d("Silent OAuth: popup blocked",null,"warn"),!1;try{let i=await Cc(r,15e3);return Pt({...t,isSignedIn:!0,accessToken:i}),await xo(),qr(),mt(),d("Silent OAuth: token refreshed successfully for "+e),!0}catch(i){d("Silent OAuth: silent refresh failed",i,"warn");try{r.close()}catch{}return!1}}async function Rc(){if(!window.opener||window.opener===window)return!1;d&&d("OAuth popup: detected popup window, checking for OAuth response");let t=window.location.hash;if(!t||t.length<=1)return d&&d("OAuth popup: no hash params found"),!1;let e=t.startsWith("#")?t.substring(1):t,n=new URLSearchParams(e),r=n.get("state");if(d&&d("OAuth popup: hash params found, state="+r),r!=="timekeeper_auth")return d&&d("OAuth popup: not our OAuth flow (wrong state)"),!1;let i=n.get("error"),o=n.get("access_token"),s="timekeeper_oauth";if(i){try{let a=new BroadcastChannel(s);a.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||i}),a.close(),d&&d("OAuth popup: error broadcast via BroadcastChannel")}catch{let p={type:"timekeeper_oauth_error",error:n.get("error_description")||i,timestamp:Date.now()};d&&d("OAuth popup: writing error to IndexedDB",p);let c=indexedDB.open("ytls-timestamps-db",4);c.onsuccess=()=>{let u=c.result,y=u.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:p});y.onsuccess=()=>{d&&d("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{d&&d("OAuth popup: failed to write error to IndexedDB",y.error,"error")},u.close()},c.onerror=()=>{d&&d("OAuth popup: failed to open IndexedDB",c.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(o){d&&d("OAuth popup: access token found, broadcasting to opener");try{let a=new BroadcastChannel(s);a.postMessage({type:"timekeeper_oauth_token",token:o}),a.close(),d&&d("OAuth popup: token broadcast via BroadcastChannel")}catch(a){d&&d("OAuth popup: BroadcastChannel failed, using IndexedDB",a);let p={type:"timekeeper_oauth_token",token:o,timestamp:Date.now()},c={...p,token:"[REDACTED]"};d&&d("OAuth popup: writing token to IndexedDB",c);let u=indexedDB.open("ytls-timestamps-db",4);u.onsuccess=()=>{let g=u.result,_=g.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:p});_.onsuccess=()=>{d&&d("OAuth popup: token written to IndexedDB successfully")},_.onerror=()=>{d&&d("OAuth popup: failed to write token to IndexedDB",_.error,"error")},g.close()},u.onerror=()=>{d&&d("OAuth popup: failed to open IndexedDB",u.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function Pc(){Pt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await xo(),await xt(),qr(),mt(),xe()}async function Oc(){let t=zt();if(!t.isSignedIn||!t.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${t.accessToken}`}});return e.status===401?(await Aa({silent:!0}),!1):e.ok}catch(e){return d("Failed to verify auth state:",e,"error"),!1}}function jr(){return gi().trim()||Sm}function Vr(){let t=vi();if(typeof t!="string")return null;let e=t.trim();return e.length>0?e:null}function To(){let t=zt();return t.isSignedIn&&!!t.accessToken}function Nc(){let t=lr();return!!jr()&&Number.isInteger(t)&&t>=1&&t<=65535&&!!Vr()}function yi(){return Ur()&&Nc()}function Gr(){return To()||yi()}function Lm(){let t=[];return To()&&t.push("Google Drive"),yi()&&t.push(`Timekeeper Backend (${jr()}:${lr()})`),t}function zc(){return`https://${jr().replace(/^https?:\/\//i,"").replace(/\/+$/,"")}:${lr()}`}async function Hc(t,e,n=3e4){let r=new AbortController,i=setTimeout(()=>r.abort(),n);try{return await fetch(t,{...e,signal:r.signal})}catch(o){throw o.name==="AbortError"?new Error("request timed out"):o}finally{clearTimeout(i)}}async function Im(t){try{let e=await Hc(t.url,{method:t.method,headers:{"User-Agent":`Timekeeper/${rr}`,...t.headers||{}},body:t.data},t.timeout),n=await e.text();return{status:e.status,responseText:n}}catch(e){throw new Error(e.message||"request failed")}}function $c(t){let e=yc(new Uint8Array(t)),n=Object.values(e)[0];return n?new TextDecoder().decode(n):null}async function Cm(t,e){let n=Vr();if(!n)throw new Error("unauthorized");let r=t.replace(/\.json$/,".zip"),i=Vc(e,t),o=Uint8Array.from(i),s=new FormData;s.append("file",new Blob([o],{type:"application/zip"}),r);let a=await Im({method:"POST",url:`${zc()}/api/v1/backups`,headers:{Authorization:`Bearer ${n}`},data:s});if(a.status===401||a.status===403)throw new Error("unauthorized");if(a.status<200||a.status>=300)throw new Error(`timekeeper backend upload failed: ${a.status} ${a.responseText}`.trim())}async function Fc(t){let e={Authorization:`Bearer ${t}`},r=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,i=await fetch(r,{headers:e});if(i.status===401)throw new Error("unauthorized");if(!i.ok)throw new Error("drive search failed");let o=await i.json();if(Array.isArray(o.files)&&o.files.length>0)return o.files[0].id;let s=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...e,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(s.status===401)throw new Error("unauthorized");if(!s.ok)throw new Error("drive folder create failed");return(await s.json()).id}async function jc(t,e,n){let r=`name='${t}' and '${e}' in parents and trashed=false`,i=encodeURIComponent(r),o=await fetch(`https://www.googleapis.com/drive/v3/files?q=${i}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)return null;let s=await o.json();return s.files&&s.files.length>0?s.files[0].id:null}async function Dm(t){try{let e=await Fc(t),n=await jc("timekeeper-data.zip",e,t);if(!n)return null;let r=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${t}`}});if(r.status===401)throw new Error("unauthorized");return r.ok?$c(await r.arrayBuffer()):null}catch(e){if(e.message==="unauthorized")throw e;return d("Failed to fetch latest Drive backup for merge:",e,"warn"),null}}async function Rm(){let t=Vr();if(!t)return null;try{let e=await Hc(`${zc()}/api/v1/backups/latest`,{headers:{Authorization:`Bearer ${t}`,"User-Agent":`Timekeeper/${rr}`}});if(e.status===401||e.status===403)throw new Error("unauthorized");return e.ok?$c(await e.arrayBuffer()):null}catch(e){if(e.message==="request timed out")return null;if(e.message==="unauthorized")throw e;return d("Failed to fetch latest backend backup for merge:",e,"warn"),null}}async function Pm(){if(!xa)return;let t=[];if(To()){let r=zt();if(r.isSignedIn&&r.accessToken){let i=r.accessToken;t.push(Dm(i).catch(async o=>(o.message==="unauthorized"&&await Aa({silent:!0}),null)))}}yi()&&t.push(Rm().catch(r=>(r.message==="unauthorized"&&d("Backend backup: unauthorized during pre-merge fetch",null,"warn"),null)));let e=await Promise.all(t),n=0;for(let r of e)if(r)try{let{mergedVideos:i,mergedTimestamps:o}=await xa(r);o>0&&(d(`Pre-backup merge: added ${o} timestamps from ${i} videos from remote`),n+=o)}catch(i){d("Failed to merge remote backup data:",i,"warn")}n>0&&Ta&&Ta()}function Vc(t,e){let n=new TextEncoder().encode(t),r=e.replace(/\\/g,"/").replace(/^\/+/,"");return r.endsWith(".json")||(r+=".json"),vc({[r]:[n,{level:6,mtime:Em,os:0}]})}async function Om(t,e,n,r){let i=t.replace(/\.json$/,".zip"),o=await jc(i,n,r),s=new TextEncoder().encode(e).length,a=Vc(e,t),p=a.length;d(`Compressing data: ${s} bytes -> ${p} bytes (${Math.round(100-p/s*100)}% reduction)`);let c="-------314159265358979",u=`\r
--${c}\r
`,g=`\r
--${c}--`,y=o?{name:i,mimeType:"application/zip"}:{name:i,mimeType:"application/zip",parents:[n]},_=8192,P="";for(let ie=0;ie<a.length;ie+=_){let de=a.subarray(ie,Math.min(ie+_,a.length));P+=String.fromCharCode.apply(null,Array.from(de))}let V=btoa(P),$=u+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+u+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+V+g,X,C;o?(X=`https://www.googleapis.com/upload/drive/v3/files/${o}?uploadType=multipart&fields=id,name`,C="PATCH"):(X="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",C="POST");let R=await fetch(X,{method:C,headers:{Authorization:`Bearer ${r}`,"Content-Type":`multipart/related; boundary=${c}`},body:$});if(R.status===401)throw new Error("unauthorized");if(!R.ok)throw new Error("drive upload failed")}async function Aa(t){d("Auth expired, attempting silent token refresh",null,"warn"),!await Bm()&&(d("Silent OAuth: falling back to sign-out",null,"warn"),Pt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await xo(),await xt(),mt("error","Authorization expired. Please sign in again."),xe())}async function Nm(t){let e=[];if(To()&&e.push({type:"google",label:"Google Drive",exportPayload:async s=>{let a=zt();if(!a.accessToken)throw new Error("unauthorized");let p=await Fc(a.accessToken);await Om(s.filename,s.json,p,a.accessToken)}}),yi()&&e.push({type:"timekeeper-backend",label:"Timekeeper backend",exportPayload:async s=>{await Cm(s.filename,s.json)}}),e.length===0)throw t?.silent||mt("error","Configure a backup destination first"),new Error("no-backup-destination");await Pm();let n=await _c({includeDeleted:!0});if(n.totalTimestamps===0){t?.silent||d("Skipping export: no timestamps to back up");return}let r=[],i=[],o=await Promise.allSettled(e.map(s=>s.exportPayload(n)));for(let s=0;s<o.length;s++){let a=o[s],p=e[s];if(a.status==="fulfilled")d(`Exported backup to ${p.label} (${n.filename}) with ${n.totalVideos} videos / ${n.totalTimestamps} timestamps.`),i.push(p.label);else{let u=a.reason.message==="unauthorized"?"auth":"other";r.push({label:p.label,kind:u,error:a.reason}),p.type==="google"&&u==="auth"?await Aa({silent:t?.silent}):d(`${p.label} export failed:`,a.reason,"error")}}if(i.length>0){r.length>0&&d(`Backup partially succeeded. Successful destinations: ${i.join(", ")}. Failed destinations: ${r.map(s=>s.label).join(", ")}`,null,"warn");return}throw r.every(s=>s.kind==="auth")?new Error("unauthorized"):new Error("backup failed")}async function Gc(){try{let[t,e,n,r,i,o,s]=await Promise.all([fn("lastAutoBackupAt"),fn("autoBackupEnabled"),fn("autoBackupIntervalMinutes"),fn("timekeeperBackendBackupEnabled"),fn("timekeeperBackendHost"),fn("timekeeperBackendPort"),fn("timekeeperBackendBearerToken")]),a=Gi.partial().safeParse({autoBackupEnabled:e,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof t=="number"&&t>0?t:null,timekeeperBackendBackupEnabled:r,timekeeperBackendHost:i,timekeeperBackendPort:o,timekeeperBackendBearerToken:s});a.success?(typeof a.data.autoBackupEnabled=="boolean"&&Ji(a.data.autoBackupEnabled),typeof a.data.autoBackupIntervalMinutes=="number"&&Xi(a.data.autoBackupIntervalMinutes),typeof a.data.lastAutoBackupAt=="number"&&ea(a.data.lastAutoBackupAt),typeof a.data.timekeeperBackendBackupEnabled=="boolean"&&ta(a.data.timekeeperBackendBackupEnabled),typeof a.data.timekeeperBackendHost=="string"&&na(a.data.timekeeperBackendHost),typeof a.data.timekeeperBackendPort=="number"&&ra(a.data.timekeeperBackendPort),(typeof a.data.timekeeperBackendBearerToken=="string"||a.data.timekeeperBackendBearerToken===null)&&oa(a.data.timekeeperBackendBearerToken)):d("Failed to validate auto backup settings:",a.error.format(),"warn")}catch(t){d("Failed to load auto backup settings:",t,"error")}}async function cr(){try{let t=_e().auth,e={autoBackupEnabled:t.autoBackupEnabled,autoBackupIntervalMinutes:t.autoBackupIntervalMinutes,lastAutoBackupAt:t.lastAutoBackupAt,timekeeperBackendBackupEnabled:t.timekeeperBackendBackupEnabled,timekeeperBackendHost:jr(),timekeeperBackendPort:t.timekeeperBackendPort,timekeeperBackendBearerToken:Vr()},n=Gi.safeParse(e);if(!n.success){d("Invalid auto backup settings, cannot save",{settings:e,errors:n.error.format()},"error");return}await Promise.all([mn("autoBackupEnabled",t.autoBackupEnabled),mn("autoBackupIntervalMinutes",t.autoBackupIntervalMinutes),mn("lastAutoBackupAt",t.lastAutoBackupAt),mn("timekeeperBackendBackupEnabled",t.timekeeperBackendBackupEnabled),mn("timekeeperBackendHost",jr()),mn("timekeeperBackendPort",t.timekeeperBackendPort),mn("timekeeperBackendBearerToken",Vr())])}catch(t){d("Failed to save auto backup settings:",t,"error")}}function zm(){fi&&(clearInterval(fi),fi=null),rt&&(clearTimeout(rt),rt=null)}function ar(t){try{let e=new Date(t),n=new Date,r=e.toDateString()===n.toDateString(),i=e.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r?i:`${e.toLocaleDateString()} ${i}`}catch{return""}}function ba(){let t=Lm();return t.length>0?`Destinations: ${t.join(", ")}`:Ur()&&!Nc()?"Timekeeper backend is enabled but incomplete":"No backup destination configured"}function Uc(){let t=_e().auth;return t.autoBackupEnabled?t.isAutoBackupRunning?"#4285f4":t.autoBackupBackoffMs&&t.autoBackupBackoffMs>0?"#ffa500":Gr()&&t.lastAutoBackupAt?"#52c41a":Gr()?"#ffa500":"#ff4d4f":"#ff4d4f"}function xe(){if(Ma(),!ve)return;let t=_e().auth;if(!t.autoBackupEnabled)ce(ve,"refresh","Backup: Off"),ve.onmouseenter=null,ve.onmouseleave=null;else if(t.isAutoBackupRunning)ce(ve,"refresh","Backing up\u2026"),ve.onmouseenter=null,ve.onmouseleave=null;else if(t.autoBackupBackoffMs&&t.autoBackupBackoffMs>0){let n=Math.ceil(t.autoBackupBackoffMs/6e4);ce(ve,"alert-triangle",`Retry in ${n}m`),ve.onmouseenter=null,ve.onmouseleave=null}else if(!Gr())ce(ve,"alert-triangle","Backup target missing"),ve.onmouseenter=null,ve.onmouseleave=null;else if(t.lastAutoBackupAt){let n=t.lastAutoBackupAt,r=n+Math.max(1,Jt())*60*1e3,i=ar(r);ve.onmouseenter=()=>{ce(ve,"database",`Next backup: ${i}`)},ve.onmouseleave=()=>{ce(ve,"database",`Last backup: ${ar(n)}`)},ce(ve,"database",`Last backup: ${ar(n)}`)}else{let n=Date.now()+Math.max(1,Jt())*60*1e3,r=ar(n);ve.onmouseenter=()=>{ce(ve,"database",`Next backup: ${r}`)},ve.onmouseleave=()=>{ce(ve,"database","Last backup: never")},ce(ve,"database","Last backup: never")}ve.style.display="inline";let e=Uc();ve.style.color=e}var ka="ytls-backup-indicator--pulsing",Hm="#4285f4",Fr=null;function $m(t,e){Fr&&(t.removeEventListener("animationiteration",Fr),Fr=null),e===Hm?(t.style.backgroundColor=e,t.classList.add(ka)):t.classList.contains(ka)?(Fr=()=>{sr&&(sr.classList.remove(ka),sr.style.backgroundColor=e,Fr=null)},t.addEventListener("animationiteration",Fr,{once:!0})):t.style.backgroundColor=e}function Ma(){if(!sr)return;let t=Uc();$m(sr,t),tt(sr,()=>{let e=_e().auth,n="";if(!e.autoBackupEnabled)n="Auto backup is disabled";else if(e.isAutoBackupRunning)n="Backup in progress";else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0)n=`Retrying backup in ${Math.ceil(e.autoBackupBackoffMs/6e4)}m`;else if(!Gr())n=ba();else if(e.lastAutoBackupAt){let r=e.lastAutoBackupAt+Math.max(1,Jt())*60*1e3,i=ar(r);n=`Last backup: ${ar(e.lastAutoBackupAt)}
Next backup: ${i}
${ba()}`}else{let r=Date.now()+Math.max(1,Jt())*60*1e3;n=`No backup yet
Next backup: ${ar(r)}
${ba()}`}return n})}async function ko(t={}){let{silent:e=!0,skipBackoff:n=!1}=t;if(!Gr()){e||(xe(),To()||Mm());return}if(rt){if(!n){d("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(rt),rt=null,$r(null),d("Auto backup: manual run cleared backoff and will proceed immediately")}if(!_e().auth.isAutoBackupRunning){Qi(!0),xe();try{await Nm({silent:e}),ea(Date.now()),di(0),$r(null),rt&&(clearTimeout(rt),rt=null),await cr()}catch(r){if(d("Auto backup failed:",r,"error"),r.message==="unauthorized"){d("Auth error detected, clearing token and stopping retries",null,"warn");let o=zt();Pt({...o,accessToken:null,isSignedIn:!1}),await xo(),mt("error","Authorization expired. Please sign in again."),xe(),di(0),$r(null),rt&&(clearTimeout(rt),rt=null)}else if(_e().auth.autoBackupRetryAttempts<kc){let o=_e().auth.autoBackupRetryAttempts+1;di(o);let a=Math.min(_m*Math.pow(2,o-1),Am);$r(a),rt&&clearTimeout(rt),rt=setTimeout(()=>{ko({silent:!0})},a),d(`Scheduling backup retry ${o}/${kc} in ${Math.round(a/1e3)}s`),xe()}else $r(null)}finally{Qi(!1),xe()}}}async function xt(t=!1){if(zm(),!!wo()&&Gr()){if(fi=setInterval(()=>{ko({silent:!0})},Math.max(1,Jt())*60*1e3),!t){let e=Date.now(),n=Math.max(1,Jt())*60*1e3,r=_e().auth.lastAutoBackupAt;(!r||e-r>=n)&&ko({silent:!0})}xe()}}async function qc(){let t=wo();Ji(!t),await cr(),await xt(),xe()}async function Zc(){let t=Jt(),e=prompt("Set Auto Backup interval (minutes):",String(t));if(e===null)return;let n=Math.floor(Number(e));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}Xi(n),await cr(),await xt(),xe()}async function Wc(){ta(!Ur()),await cr(),await xt(),xe()}async function Kc(){let t=prompt("Set the Timekeeper backend host:",jr());if(t===null)return;let e=t.trim().replace(/^https?:\/\//i,"").replace(/\/+$/,"");if(!e){alert("Please enter a host name or IP address.");return}na(e),await cr(),await xt(),xe()}async function Yc(){let t=prompt("Set the Timekeeper backend port:",String(lr()));if(t===null)return;let e=Number.parseInt(t.trim(),10);if(!Number.isInteger(e)||e<1||e>65535){alert("Please enter a valid port between 1 and 65535.");return}ra(e),await cr(),await xt(),xe()}async function Jc(){let t=Vr(),n=prompt(t?"Set the Timekeeper backend bearer token (leave blank to clear it):":"Set the Timekeeper backend bearer token:",t??"");if(n===null)return;let r=n.trim();oa(r.length>0?r:null),await cr(),await xt(),xe()}function Ba(t,e){return si(t).then(n=>n!==void 0?n:e)}function La(t,e){return ai(t,e),Promise.resolve()}var Ia=window.location.hash;if(Ia&&Ia.length>1){let t=new URLSearchParams(Ia.substring(1));if(t.get("state")==="timekeeper_auth"){let n=t.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let r=new BroadcastChannel("timekeeper_oauth"),i={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:i.type,tokenLength:n.length}),r.postMessage(i),r.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(r){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",r);let i={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},o=indexedDB.open("ytls-timestamps-db",4);o.onsuccess=()=>{let s=o.result,a=s.transaction("settings","readwrite");a.objectStore("settings").put({key:"oauth_message",value:i}),a.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",i.timestamp),s.close()}}}if(history.replaceState){let r=window.location.pathname+window.location.search;history.replaceState(null,"",r)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}nc();(async function(){"use strict";if(window.top!==window.self)return;function t(l){return Ba(l,void 0)}function e(l,m){return La(l,m)}Ea(t),Sa(e);try{let l=await si("device_id"),m=typeof l=="string"&&l.length>0?l:crypto.randomUUID();await ai("device_id",m),d(`Lamport: device_id = ${m}`)}catch(l){d("Lamport: failed to initialize device_id:",l,"warn")}if(await Rc()){d("OAuth popup detected, broadcasting token and closing");return}await _a();let r=["/watch","/live"];function i(l=window.location.href){try{let m=new URL(l);return m.origin!=="https://www.youtube.com"?!1:r.some(h=>m.pathname===h||m.pathname.startsWith(`${h}/`))}catch(m){return d("Timekeeper failed to parse URL for support check:",m,"error"),!1}}let o=null,s=null,a=null,p=null,c=null,u=null,g=(()=>{try{let l=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(l)&&l>0&&l!==1?Math.min(l,4):2}catch{return 2}})(),y=null,_=null,P=250,V=null,$=!1;function X(){return _e().ui.minPaneHeight}function C(l){jl(l)}function R(){return _e().ui.lastHandledUrl}function ie(l){Gl(l)}function de(){return _e().ui.urlChangeHandlersSetup}function Ae(l){Ul(l)}function ye(){return _e().ui.panePosition}function Y(l){Vl(l)}function W(){return _e().timestamps.items}function Me(l){ql(l)}function Ce(){return _e().timestamps.currentIndex}function $e(l){Zl(l)}function ot(){return o?o.getBoundingClientRect():null}function Fe(l,m,h){l&&Y({x:Math.round(typeof m=="number"?m:l.left),y:Math.round(typeof h=="number"?h:l.top),width:Math.round(l.width),height:Math.round(l.height)})}function De(l=!0){if(!o)return;vr();let m=ot();if(m&&(m.width||m.height)&&(Fe(m),l)){let h=ye();Fo("windowPosition",h),Zr({type:"window_position_updated",position:h,timestamp:Date.now()})}}function Be(){if(!o||!s||!p||!a)return;let l=40,m=we();if(m.length>0)l=m[0].offsetHeight;else{let h=document.createElement("li");h.style.visibility="hidden",h.style.position="absolute",h.textContent="00:00 Example",a.appendChild(h),l=h.offsetHeight,a.removeChild(h)}P=s.offsetHeight+p.offsetHeight+l,C(P),o.style.minHeight=X()+"px"}function be(){requestAnimationFrame(()=>{je?.(),Be(),De(!0)})}function Ue(l=450){Ne&&(clearTimeout(Ne),Ne=null),Ne=setTimeout(()=>{at(),be(),Ne=null},l)}function Oe(){Ne&&(clearTimeout(Ne),Ne=null)}function hn(){a&&(a.style.visibility="hidden",d("Hiding timestamps during show animation")),be(),Ue()}function it(){at(),Oe(),St&&(clearTimeout(St),St=null),St=setTimeout(()=>{o&&(o.style.display="none",es(),St=null)},400)}function at(){if(!a){ft&&(ft(),ft=null,Qt=null,On=null);return}if(!On){a.style.visibility==="hidden"&&(a.style.visibility="",d("Restoring timestamp visibility (no deferred fragment)")),ft&&(ft(),ft=null,Qt=null);return}d("Appending deferred timestamps after animation"),a.appendChild(On),On=null,kn(),wn(),a.style.visibility==="hidden"&&(a.style.visibility="",d("Restoring timestamp visibility after append")),ft&&(ft(),ft=null,Qt=null),Bt(),Je(),je&&requestAnimationFrame(je),Lt(!0)}let Re=null,ke=!1,le="ytls-timestamp-pending-delete",Pe="ytls-timestamp-highlight",Tt="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",Xt="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function ur(){let l=m=>{let h=new Image;h.src=m};l(Tt),l(Xt)}ur();async function dr(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(l=>setTimeout(l,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(l=>setTimeout(l,100));await new Promise(l=>setTimeout(l,200))}let gn=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],Dn=5e3,vn=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function pr(l){return vn.has(l)}function gt(){return document.querySelector("video")}let Rn=null;function ge(){if(Rn&&document.contains(Rn))return Rn;let l=document.getElementById("movie_player");return l&&document.contains(l)?l:null}function Ca(l){return(Math.round(l*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function Da(l){let m=l===1?2:l;g=m;try{localStorage.setItem("ytls-last-speed",String(m))}catch{}}function bi(l){if(!u)return;let m=typeof l=="number"?l:gt()?.playbackRate??1,h=Ca(m);u.textContent=`${h}x`,u.setAttribute("aria-label",`Playback speed ${h}x`),Math.abs(m-1)>.01?u.classList.add("ytls-playback-speed-active"):u.classList.remove("ytls-playback-speed-active")}function Xc(l){let m=ge(),h=gt();if(m&&typeof m.setPlaybackRate=="function")m.setPlaybackRate(l);else if(h)h.playbackRate=l;else return!1;return Da(l),bi(l),!0}function Ra(){let l=gt()?.playbackRate;return Number.isFinite(l)?Xc(Math.abs(l-1)<=.001?g:1):!1}function Qc(l){return l instanceof Element?!!l.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function ki(l){return gn.every(m=>typeof l?.[m]=="function"?!0:pr(m)?!!gt():!1)}function eu(l){return gn.filter(m=>typeof l?.[m]=="function"?!1:pr(m)?!gt():!0)}async function tu(l=Dn){let m=Date.now();for(;Date.now()-m<l;){let k=ge();if(ki(k))return k;await new Promise(E=>setTimeout(E,100))}let h=ge();return ki(h),h}let Pa="timestampOffsetSeconds",nu=-5,Oa="shiftClickTimeSkipSeconds",ru=10,wi=300,xi=300,Ht=null;function Na(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function za(){if(Na()&&!Ht)try{Ht=new BroadcastChannel("ytls_timestamp_channel"),Ht.onmessage=Ha}catch(l){d("Failed to create BroadcastChannel:",l,"warn"),Ht=null}}function Zr(l){if(!Na()){d("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(za(),!Ht){d("No BroadcastChannel available to post message","warn");return}try{Ht.postMessage(l)}catch(m){d("BroadcastChannel error, reopening:",m,"warn");try{Ht=new BroadcastChannel("ytls_timestamp_channel"),Ht.onmessage=Ha,Ht.postMessage(l)}catch(h){d("Failed to reopen BroadcastChannel:",h,"error")}}}function Ha(l){if(d("Received message from another tab:",l.data),!(!i()||!a||!o)&&l.data){if(l.data.type==="timestamps_updated"&&l.data.videoId===He)d("Debouncing timestamp load due to external update for video:",l.data.videoId),clearTimeout(Kr),Kr=setTimeout(()=>{d("Reloading timestamps due to external update for video:",l.data.videoId),Bi()},500);else if(l.data.type==="window_position_updated"&&o){let m=l.data.position;if(m&&typeof m.x=="number"&&typeof m.y=="number"){o.style.left=`${m.x}px`,o.style.top=`${m.y}px`,o.style.right="auto",o.style.bottom="auto",typeof m.width=="number"&&m.width>0&&(o.style.width=`${m.width}px`),typeof m.height=="number"&&m.height>0&&(o.style.height=`${m.height}px`);let h=o.getBoundingClientRect();Y({x:Math.round(m.x),y:Math.round(m.y),width:Math.round(h.width),height:Math.round(h.height)});let k=document.documentElement.clientWidth,E=document.documentElement.clientHeight;(h.left<0||h.top<0||h.right>k||h.bottom>E)&&vr()}}}}za();let mr=await Ba(Pa);(typeof mr!="number"||Number.isNaN(mr))&&(mr=nu,await La(Pa,mr));let Wr=await Ba(Oa);(typeof Wr!="number"||Number.isNaN(Wr))&&(Wr=ru,await La(Oa,Wr));let Kr=null,Pn=new Map,fr=!1,G=null,So=null,He=null,St=null,Ne=null,Et=null,st=null,yn=null,Ti=!1,je=null,On=null,Qt=null,ft=null,bn=null,Eo=!1,jm=null,Si=!1,_o=null,Ao=null,Mo=null,Bo=null,Lo=null,Io=null,Co=null,Do=null,Yr=null,Jr=null,Xr=null,_t=null,At=null,$a=0,Qr=!1,Nn=null,eo=null;function we(){return li(a)}function Ei(){return Hl(a)}function Mt(){return eo!==null||(eo=$l(a)),eo}function kn(){eo=null}function ou(l){let m=l.querySelector(".time-diff");return m?(m.textContent?.trim()||"").startsWith("-"):!1}let iu="\u251C\u2500 ",Fa="\u2514\u2500 ",ja=/^[├└]─\s/;function Ro(l){return ja.test(l)}function Va(l){return l.replace(ja,"")}function Ga(l){let m=we();if(l>=m.length-1)return Fa;let E=m[l+1].querySelector("input");return E&&Ro(E.value)?iu:Fa}function au(l,m){return`${Ga(m)}${l}`}function Bt(){if(!a)return;we().forEach((m,h)=>{let k=m.querySelector("input");if(!k||!Ro(k.value))return;let E=Va(k.value),A=au(E,h);k.value!==A&&(k.value=A)})}function to(){ci(a),On&&(On=null),ft&&(ft(),ft=null,Qt=null)}function no(){zl(a,ke)}function Ua(l){Yi(a,l)}function _i(){Pl(a)}function Ai(l){if(!(!o||!a)){if(ke=l,l)o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),Ua("Loading timestamps...");else if(_i(),o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),c){let m=ge();if(m){let h=m.getCurrentTime(),k=Number.isFinite(h)?Math.max(0,Math.floor(h)):Math.max(0,Mt()),{isLive:E}=m.getVideoData()||{isLive:!1},A=a?we().map(b=>{let B=b.querySelector("[data-time]");return B?parseFloat(B.getAttribute("data-time")??"0"):0}):[],x="";if(A.length>0)if(E){let b=Math.max(1,k/60),B=A.filter(O=>O<=k);if(B.length>0){let O=(B.length/b).toFixed(2);parseFloat(O)>0&&(x=` (${O}/min)`)}}else{let b=m.getDuration(),B=Number.isFinite(b)&&b>0?b:0,O=Math.max(1,B/60),U=(A.length/O).toFixed(1);parseFloat(U)>0&&(x=` (${U}/min)`)}c.textContent=`${Ut(k)}${x}`}}!ke&&a&&!mo(a)&&no(),en()}}function su(l){return l?Or.safeParse(l).success:!1}function Po(l,m){l.dataset.time=String(m),l.textContent=Ut(m,Mt())}let Oo=null,No=null,$t=!1;function qa(l){if(!l||typeof l.getVideoData!="function"||!l.getVideoData()?.isLive)return!1;if(typeof l.getProgressState=="function"){let h=l.getProgressState(),k=Number(h?.seekableEnd??h?.liveHead??h?.head??h?.duration),E=Number(h?.current??l.getCurrentTime?.());if(Number.isFinite(k)&&Number.isFinite(E))return k-E>2}return!1}function lu(l,m){if(!Number.isFinite(l))return;let h=Za(l);Mi(h,m)}function Lt(l=!1,m){if(fr&&!l)return;let h;if(typeof m=="number"&&Number.isFinite(m))h=Math.max(0,Math.floor(m));else{let k=ge(),E=k?k.getCurrentTime():NaN;h=Number.isFinite(E)?Math.max(0,Math.floor(E)):Math.max(0,Mt())}Number.isFinite(h)&&lu(h,l)}function Za(l){if(!Number.isFinite(l))return null;let m=we();if(m.length===0)return null;let h=null,k=-1/0;for(let E of m){let x=E.querySelector("[data-time]")?.dataset.time;if(!x)continue;let b=Number.parseInt(x,10);Number.isFinite(b)&&b<=l&&b>k&&(k=b,h=E)}return h}function Mi(l,m=!1){if(we().forEach(k=>{k.classList.contains(le)||k.classList.remove(Pe)}),!!l&&!l.classList.contains(le)&&(l.classList.add(Pe),m))try{if(a instanceof HTMLElement){let k=l.getBoundingClientRect(),E=a.getBoundingClientRect();!(k.bottom<E.top||k.top>E.bottom)||l.scrollIntoView({behavior:"smooth",block:"center"})}else l.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{l.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function cu(l){if(Ft()||!Number.isFinite(l)||l===0)return!1;let m=we();if(m.length===0)return!1;let h=!1;return m.forEach(k=>{let E=k.querySelector("[data-time]"),A=E?.dataset.time;if(!E||!A)return;let x=Number.parseInt(A,10);if(!Number.isFinite(x))return;let b=Math.max(0,x+l);b!==x&&(Po(E,b),h=!0)}),h?(wn(),Bt(),Je(),Ho(He),Nn=null,!0):!1}function Wa(l,m={}){if(!Number.isFinite(l)||l===0)return!1;if(!cu(l)){if(m.alertOnNoChange){let x=m.failureMessage??"Offset did not change any timestamps.";alert(x)}return!1}let k=m.logLabel??"bulk offset";d(`Timestamps changed: Offset all timestamps by ${l>0?"+":""}${l} seconds (${k})`);let E=ge(),A=E?Math.floor(E.getCurrentTime()):0;if(Number.isFinite(A)){let x=Za(A);Mi(x,!1)}return!0}function Ka(l){if(!a||ke)return;let m=l.target instanceof Element?l.target:null;if(!m)return;let h=m.closest("[data-time]"),k=m.closest("[data-increment]"),E=m.closest("[data-action]");if(h?.dataset.time){l.preventDefault();let A=Number(h.dataset.time);if(Number.isFinite(A)){d(`Seeking to timestamp ${A}`),$t=!0;let b=ge();b&&(b.setPlaybackRate(1),b.seekTo(A)),setTimeout(()=>{$t=!1},500)}let x=h.closest("li");x&&(we().forEach(b=>{b.classList.contains(le)||b.classList.remove(Pe)}),x.classList.contains(le)||(x.classList.add(Pe),x.scrollIntoView({behavior:"smooth",block:"center"})))}else if(k?.dataset.increment){l.preventDefault();let A=k.closest("li"),x=A?.querySelector("[data-time]");if(!x||!x.dataset.time)return;let b=parseInt(x.dataset.time,10),B=parseInt(k.dataset.increment,10);if("shiftKey"in l&&l.shiftKey&&(B*=Wr),"altKey"in l?l.altKey:!1){Wa(B,{logLabel:"Alt adjust"});return}let ne=Math.max(0,b+B);if(d(`Timestamps changed: Timestamp time incremented from ${b} to ${ne}`),ge()?.setPlaybackRate(1),kn(),Po(x,ne),No=ne,Oo&&clearTimeout(Oo),$t=!0,Oo=setTimeout(()=>{if(No!==null){let fe=ge();fe&&fe.seekTo(No)}Oo=null,No=null,setTimeout(()=>{$t=!1},500)},500),wn(),Bt(),Je(),A){let fe=A.querySelector("input"),Se=A.dataset.guid;fe&&Se&&(hr(He,Se,ne,fe.value),Nn=Se)}}else E?.dataset.action==="clear"&&(l.preventDefault(),d("Timestamps changed: All timestamps cleared from UI"),a.textContent="",kn(),Je(),zo(),Ho(He,{allowEmpty:!0}),Nn=null,no())}function ro(l,m="",h=!1,k=null,E=!0){if(!a)return null;let A=Math.max(0,l),x=k??crypto.randomUUID(),b=document.createElement("li"),B=document.createElement("div"),O=document.createElement("span"),U=document.createElement("span"),ne=document.createElement("span"),fe=document.createElement("div"),Se=document.createElement("span"),lt=document.createElement("span"),re=document.createElement("input"),Ee=document.createElement("button");b.dataset.guid=x,B.className="time-row",fe.className="ytls-row-controls";let Xe=document.createElement("div");Xe.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",tt(Xe,"Click to toggle indent");let Qe=document.createElement("span");Qe.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let xn=()=>{let Q=re.offsetTop,ee=re.offsetHeight||20;Xe.style.top=`${Q}px`,Xe.style.height=`${ee}px`},zn=()=>{Ze(Qe,Ro(re.value)?"indent-decrease":"indent-increase",18)},yr="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",Tn=Q=>{let ee=Qe.querySelector("svg");ee&&(ee.style.transition="filter 0.15s ease",ee.style.filter=Q?yr:"none")},br=Q=>{Q.stopPropagation();let ee=Ro(re.value),pe=Va(re.value),ue="";if(!ee){let vt=we().indexOf(b);ue=Ga(vt)}re.value=ue?`${ue}${pe}`:pe,zn(),Bt();let Le=Number.parseInt(Se.dataset.time??"0",10);hr(He,x,Le,re.value)};Xe.onclick=br,Xe.append(Qe),Xe.addEventListener("mouseenter",()=>{Tn(!0)}),Xe.addEventListener("mouseleave",()=>{Tn(!1)}),b.style.cssText="position:relative;padding-left:20px;",b.addEventListener("mouseenter",()=>{xn(),zn(),Qe.style.display="inline"}),b.addEventListener("mouseleave",()=>{Tn(!1),Qe.style.display="none"}),b.addEventListener("mouseleave",()=>{b.dataset.guid===Nn&&ou(b)&&Ya()}),re.value=m||"",re.style.cssText="width:100%;margin-top:5px;display:block;",re.type="text",re.setAttribute("inputmode","text"),re.autocapitalize="off",re.autocomplete="off",re.spellcheck=!1,requestAnimationFrame(xn);let oo=!1;re.addEventListener("focusin",()=>{Qr=!1,oo=!1}),re.addEventListener("focusout",Q=>{let ee=Q.relatedTarget,pe=Date.now()-$a<250,ue=!!ee&&!!o&&o.contains(ee);!pe&&!ue&&!oo&&(Qr=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(re.focus({preventScroll:!0}),Qr=!1)},0))}),re.addEventListener("keydown",Q=>{(Q.key==="Escape"||Q.key==="Esc")&&(Q.preventDefault(),oo=!0,re.blur())}),re.addEventListener("input",Q=>{let ee=Q;if(ee&&(ee.isComposing||ee.inputType==="insertCompositionText"))return;let pe=Pn.get(x);pe&&clearTimeout(pe);let ue=setTimeout(()=>{let Le=Number.parseInt(Se.dataset.time??"0",10);hr(He,x,Le,re.value),Pn.delete(x)},500);Pn.set(x,ue)}),re.addEventListener("compositionend",()=>{let Q=Number.parseInt(Se.dataset.time??"0",10);setTimeout(()=>{hr(He,x,Q,re.value)},50)});let jo="#f4ba78",tn="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",Vo="#c8452d",Go="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",Hn=(Q,ee=jo,pe=tn)=>{Q.style.color=ee;let ue=Q.querySelector("svg");ue&&(ue.style.transition="filter 0.15s ease"),Q.addEventListener("mouseenter",()=>{ue&&(ue.style.filter=pe)}),Q.addEventListener("mouseleave",()=>{ue&&(ue.style.filter="none")})};Ze(O,"circle-minus",18),O.classList.add("ytls-row-control"),O.dataset.increment="-1",O.style.cursor="pointer",O.style.margin="0px",Hn(O),Ze(ne,"circle-plus",18),ne.classList.add("ytls-row-control"),ne.dataset.increment="1",ne.style.cursor="pointer",ne.style.margin="0px",Hn(ne),Ze(U,"current-location",18),U.classList.add("ytls-row-control"),U.style.cursor="pointer",U.style.margin="0px",tt(U,"Set to current playback time"),Hn(U),U.onclick=()=>{let Q=ge(),ee=Q?Math.floor(Q.getCurrentTime()):0;Number.isFinite(ee)&&(d(`Timestamps changed: set to current playback time ${ee}`),ge()?.setPlaybackRate(1),kn(),Po(Se,ee),wn(),Bt(),hr(He,x,ee,re.value),Nn=x)},kn(),Po(Se,A),Se.addEventListener("click",Q=>{Q.preventDefault(),Q.stopPropagation();let ee=Number(Se.dataset.time);if(!Number.isFinite(ee))return;d(`Seeking to timestamp ${ee}`),$t=!0;let pe=ge();pe&&(pe.setPlaybackRate(1),pe.seekTo(ee));let ue=gt();ue?.paused&&ue.play(),setTimeout(()=>{$t=!1},500),a?.querySelectorAll(`.${Pe}`).forEach(Le=>Le.classList.remove(Pe)),b.classList.contains(le)||(b.classList.add(Pe),b.scrollIntoView({behavior:"smooth",block:"center"}))}),Ze(Ee,"trash",16),Ee.classList.add("ytls-row-control"),Ee.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",Hn(Ee,Vo,Go),Ee.onclick=()=>{let Q=null,ee=null,pe=null,ue=()=>{try{b.removeEventListener("click",ee,!0)}catch{}try{document.removeEventListener("click",ee,!0)}catch{}if(a)try{a.removeEventListener("mouseleave",pe)}catch{}Q&&(clearTimeout(Q),Q=null)};if(b.dataset.deleteConfirmed==="true"){d("Timestamps changed: Timestamp deleted");let Le=b.dataset.guid??"",et=Pn.get(Le);et&&(clearTimeout(et),Pn.delete(Le)),ue(),b.remove(),kn(),wn(),Bt(),Je(),zo(),uu(He,Le),Nn=null,no()}else{b.dataset.deleteConfirmed="true",b.classList.add(le),b.classList.remove(Pe);let Le=()=>{b.dataset.deleteConfirmed="false",b.classList.remove(le);let et=ge(),vt=et?et.getCurrentTime():0,kr=Number.parseInt(b.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(vt)&&Number.isFinite(kr)&&vt>=kr&&b.classList.add(Pe),ue()};ee=et=>{et.target!==Ee&&Le()},pe=()=>{b.dataset.deleteConfirmed==="true"&&Le()},b.addEventListener("click",ee,!0),document.addEventListener("click",ee,!0),a&&a.addEventListener("mouseleave",pe),Q=setTimeout(()=>{b.dataset.deleteConfirmed==="true"&&Le(),ue()},5e3)}},lt.className="time-diff",lt.style.color="#888",lt.style.marginLeft="5px",fe.append(O,U,ne,Ee),B.append(Se,fe,lt),b.append(Xe,B,re);let Uo=Number.parseInt(Se.dataset.time??"0",10);if(E){_i();let Q=!1,ee=we();for(let pe=0;pe<ee.length;pe++){let ue=ee[pe],et=ue.querySelector("[data-time]")?.dataset.time;if(!et)continue;let vt=Number.parseInt(et,10);if(Number.isFinite(vt)&&Uo<vt){a.insertBefore(b,ue),Q=!0;break}}Q||a.appendChild(b),b.scrollIntoView({behavior:"smooth",block:"center"}),kn(),wn(),zo(),Bt(),Je(),h||(hr(He,x,A,m),Nn=x,Mi(b,!1))}else re.__ytls_li=b;return re}function wn(){if(Ft())return;let l=Mt(),m=we();m.forEach((h,k)=>{let E=h.querySelector(".time-diff"),A=h.querySelector("[data-time]"),x=A?.dataset.time;if(A&&x){let lt=Number.parseInt(x,10);Number.isFinite(lt)&&(A.textContent=Ut(lt,l))}if(!E)return;if(!x){E.textContent="";return}let b=Number.parseInt(x,10);if(!Number.isFinite(b)){E.textContent="";return}if(k===0){E.textContent="";return}let U=m[k-1].querySelector("[data-time]")?.dataset.time;if(!U){E.textContent="";return}let ne=Number.parseInt(U,10);if(!Number.isFinite(ne)){E.textContent="";return}let fe=b-ne,Se=fe<0?"-":"";E.textContent=` ${Se}${Ut(Math.abs(fe))}`})}function Ya(){if(Ft())return;let l=null;if(document.activeElement instanceof HTMLInputElement&&a.contains(document.activeElement)){let x=document.activeElement,B=x.closest("li")?.dataset.guid;if(B){let O=x.selectionStart??x.value.length,U=x.selectionEnd??O,ne=x.scrollLeft;l={guid:B,start:O,end:U,scroll:ne}}}let m=we();if(m.length===0)return;let h=m.map(x=>x.dataset.guid),k=m.map(x=>{let b=x.querySelector("[data-time]"),B=b?.dataset.time;if(!b||!B)return null;let O=Number.parseInt(B,10);if(!Number.isFinite(O))return null;let U=x.dataset.guid??"";return{time:O,guid:U,element:x}}).filter(x=>x!==null).sort((x,b)=>{let B=x.time-b.time;return B!==0?B:x.guid.localeCompare(b.guid)}),E=k.map(x=>x.guid),A=h.length!==E.length||h.some((x,b)=>x!==E[b]);if(a.replaceChildren(),k.forEach(x=>{a.appendChild(x.element)}),wn(),Bt(),Je(),l){let b=we().find(B=>B.dataset.guid===l.guid)?.querySelector("input");if(b)try{b.focus({preventScroll:!0})}catch{}}A&&(d("Timestamps changed: Timestamps sorted"),Ho(He))}function zo(){if(!a||!o||!s||!p)return;let l=we().length;je?.();let m=o.getBoundingClientRect(),h=s.getBoundingClientRect(),k=p.getBoundingClientRect(),E=Math.max(0,m.height-(h.height+k.height));l===0?(no(),a.style.overflowY="hidden"):a.style.overflowY=a.scrollHeight>E?"auto":"hidden"}function Je(){if(!a)return;let l=gt(),m=document.querySelector(".ytp-progress-bar"),h=ge(),k=h?h.getVideoData():null,E=!!k&&!!k.isLive;if(!l||!m||!isFinite(l.duration)||E)return;Xa(),we().map(x=>{let b=x.querySelector("[data-time]"),B=b?.dataset.time;if(!b||!B)return null;let O=Number.parseInt(B,10);if(!Number.isFinite(O))return null;let ne=x.querySelector("input")?.value??"",fe=x.dataset.guid??crypto.randomUUID();return x.dataset.guid||(x.dataset.guid=fe),{start:O,comment:ne,guid:fe}}).filter(su).forEach(x=>{if(!Number.isFinite(x.start))return;let b=document.createElement("div");b.className="ytls-marker",b.style.position="absolute",b.style.height="100%",b.style.width="2px",b.style.backgroundColor="#ff0000",b.style.cursor="pointer",b.style.left=x.start/l.duration*100+"%",b.dataset.time=String(x.start),b.addEventListener("click",()=>{let B=ge();B&&B.seekTo(x.start)}),m.appendChild(b)})}function Ho(l,m={}){if(!a||Ft()||!l)return;if(ke){d("Save blocked: timestamps are currently loading");return}Bt();let h=Ei().sort((k,E)=>k.start-E.start);if(h.length===0&&!m.allowEmpty){d("Save skipped: no timestamps to save");return}Me(h),Qa(l,h).then(()=>{d(`Successfully saved ${h.length} timestamps for ${l} to IndexedDB`),$o()}).catch(k=>{let E=`Failed to save timestamps: ${k.message}`;d(`Failed to save timestamps for ${l} to IndexedDB:`,k,"error"),gr(E)}),Zr({type:"timestamps_updated",videoId:l,action:"saved"})}function hr(l,m,h,k){if(!l||ke||Ft())return;let E={guid:m,start:h,comment:k};d(`Saving timestamp: guid=${m}, start=${h}, comment="${k}"`),gu(l,E).then(()=>{a&&$o()}).catch(A=>{let x=`Failed to save timestamp: ${A.message}`;d(`Failed to save timestamp ${m}:`,A,"error"),gr(x)}),Zr({type:"timestamps_updated",videoId:l,action:"saved"})}function uu(l,m){!l||ke||Ft()||(vu(l,m).then(()=>{a&&$o()}).catch(h=>{let k=`Failed to delete timestamp: ${h.message}`;d(`Failed to delete timestamp ${m}:`,h,"error"),gr(k)}),Zr({type:"timestamps_updated",videoId:l,action:"saved"}))}async function Ja(l){if(Ft()){alert("Cannot export timestamps while an error is being displayed.");return}let m=He;if(!m)return;d(`Exporting timestamps for video ID: ${m}`);let h=Ei(),k=Math.max(Mt(),0),E=or();if(l==="json"){let A=new Blob([JSON.stringify(h,null,2)],{type:"application/json"}),x=URL.createObjectURL(A),b=document.createElement("a");b.href=x,b.download=`timestamps-${m}-${E}.json`,b.click(),URL.revokeObjectURL(x)}else if(l==="text"){let A=h.map(O=>{let U=Ut(O.start,k),ne=`${O.comment} <!-- guid:${O.guid} -->`.trimStart();return`${U} ${ne}`}).join(`
`),x=new Blob([A],{type:"text/plain"}),b=URL.createObjectURL(x),B=document.createElement("a");B.href=b,B.download=`timestamps-${m}-${E}.txt`,B.click(),URL.revokeObjectURL(b)}}function gr(l){if(!o||!a){d("Timekeeper error:",l,"error");return}Ol(a,l),ia(l),Je()}function $o(){a&&(Nl(a),ia(null))}function Ft(){return!!(!a||mo(a)||ke||Wl()!==null)}function Xa(){document.querySelectorAll(".ytls-marker").forEach(l=>l.remove())}function vr(){if(!o||!document.body.contains(o))return;let l=o.getBoundingClientRect(),m=document.documentElement.clientWidth,h=document.documentElement.clientHeight,k=l.width,E=l.height;if(l.left<0&&(o.style.left="0",o.style.right="auto"),l.right>m){let A=Math.max(0,m-k);o.style.left=`${A}px`,o.style.right="auto"}if(l.top<0&&(o.style.top="0",o.style.bottom="auto"),l.bottom>h){let A=Math.max(0,h-E);o.style.top=`${A}px`,o.style.bottom="auto"}}function du(){if(_o&&(document.removeEventListener("mousemove",_o),_o=null),Ao&&(document.removeEventListener("mouseup",Ao),Ao=null),Yr&&(document.removeEventListener("keydown",Yr),Yr=null),Mo&&(window.removeEventListener("resize",Mo),Mo=null),Jr&&(document.removeEventListener("pointerdown",Jr,!0),Jr=null),Xr&&(document.removeEventListener("pointerup",Xr,!0),Xr=null),_t){try{_t.disconnect()}catch{}_t=null}if(At){try{At.disconnect()}catch{}At=null}let l=gt();l&&(Bo&&(l.removeEventListener("timeupdate",Bo),Bo=null),Lo&&(l.removeEventListener("pause",Lo),Lo=null),Io&&(l.removeEventListener("play",Io),Io=null),Co&&(l.removeEventListener("seeking",Co),Co=null),Do&&(l.removeEventListener("ratechange",Do),Do=null))}function pu(){Xa(),Pn.forEach(m=>clearTimeout(m)),Pn.clear(),Kr&&(clearTimeout(Kr),Kr=null),Re&&(clearInterval(Re),Re=null),St&&(clearTimeout(St),St=null),du(),ml();try{Ht.close()}catch{}if(G&&G.parentNode===document.body&&document.body.removeChild(G),G=null,So=null,fr=!1,He=null,_t){try{_t.disconnect()}catch{}_t=null}if(At){try{At.disconnect()}catch{}At=null}o&&o.parentNode&&o.remove();let l=document.getElementById("ytls-header-button");l&&l.parentNode&&l.remove(),bn=null,Eo=!1,Y(null),to(),o=null,s=null,a=null,p=null,st=null,yn=null,je=null,c=null,u=null,y=null,Rn=null}async function mu(){let l=Li();if(!l)return Rn=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let m=await tu();if(!ki(m)){let h=eu(m),k=h.length?` Missing methods: ${h.join(", ")}.`:"",E=m?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return Rn=null,{ok:!1,message:`${E}${k} Try refreshing once playback is ready.`}}return Rn=m,{ok:!0,player:m,videoId:l}}async function Bi(){if(!o||!a)return;let l=a.scrollTop,m=!0,h=()=>{if(!a||!m)return;let k=Math.max(0,a.scrollHeight-a.clientHeight);a.scrollTop=Math.min(l,k)};try{let k=await mu();if(!k.ok){gr(k.message),to(),Je();return}let{videoId:E}=k,A=[];try{let x=await yu(E);x?(A=x.map(b=>({...b,guid:b.guid||crypto.randomUUID()})),d(`Loaded ${A.length} timestamps from IndexedDB for ${E}`),$o()):d(`No timestamps found in IndexedDB for ${E}`)}catch(x){let b=`Failed to load timestamps: ${x.message}`;d(`Failed to load timestamps from IndexedDB for ${E}:`,x,"error"),gr(b),Je();return}if(A.length>0){A.sort((B,O)=>B.start-O.start),to(),_i();let x=document.createDocumentFragment();A.forEach(B=>{let U=ro(B.start,B.comment,!0,B.guid,!1).__ytls_li;U&&x.appendChild(U)}),o&&o.classList.contains("ytls-zoom-in")&&Ne!=null?(d("Deferring timestamp DOM append until show animation completes"),On=x,Qt||(Qt=new Promise(B=>{ft=B})),await Qt):a&&(a.appendChild(x),kn(),wn(),Bt(),Je(),je&&requestAnimationFrame(je)),Me(A),Lt(!0),m=!1}else to(),Ua("No timestamps for this video"),Je(),Me([]),je&&requestAnimationFrame(je)}catch(k){d("Unexpected error while loading timestamps:",k,"error"),gr("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Qt&&await Qt,requestAnimationFrame(h),je&&requestAnimationFrame(je),a&&!mo(a)&&no()}}function Li(){let m=new URLSearchParams(location.search).get("v");if(m)return m;let h=document.querySelector('meta[itemprop="identifier"]');return h?.content?h.content:null}function fu(l=null,m=null){if(!c)return;let h=gt(),k=m||ge();if(!h&&!k)return;let E=l!==null?l:k?k.getCurrentTime():0,A=Number.isFinite(E)?Math.max(0,Math.floor(E)):Math.max(0,Mt()),{isLive:x}=k?k.getVideoData()||{isLive:!1}:{isLive:!1},b=k?qa(k):!1,B=a?we().map(U=>{let ne=U.querySelector("[data-time]");return ne?parseFloat(ne.getAttribute("data-time")??"0"):0}):[],O="";if(B.length>0)if(x){let U=Math.max(1,A/60),ne=B.filter(fe=>fe<=A);if(ne.length>0){let fe=(ne.length/U).toFixed(2);parseFloat(fe)>0&&(O=` (${fe}/min)`)}}else{let U=k?k.getDuration():0,ne=Number.isFinite(U)&&U>0?U:h&&Number.isFinite(h.duration)&&h.duration>0?h.duration:0,fe=Math.max(1,ne/60),Se=(B.length/fe).toFixed(1);parseFloat(Se)>0&&(O=` (${Se}/min)`)}c.textContent=`${Ut(A)}${O}`,c.style.color=b?"#ff4d4f":""}function hu(){let l=gt();if(!l)return;let m=()=>{if(!a)return;let b=ge(),B=b?Math.floor(b.getCurrentTime()):0;Number.isFinite(B)&&(c&&!ke&&!$t&&fu(B,b),Lt(!1,B))},h=b=>{try{let B=new URL(window.location.href);b!==null&&Number.isFinite(b)?B.searchParams.set("t",`${Math.floor(b)}s`):B.searchParams.delete("t"),window.history.replaceState({},"",B.toString())}catch{}},k=()=>{let b=ge(),B=b?b.getCurrentTime():NaN,O=Number.isFinite(B)?Math.max(0,Math.floor(B)):Math.max(0,Mt());if(Number.isFinite(O)){h(O);try{Lt(!0)}catch(U){d("Failed to highlight nearest timestamp on pause:",U,"warn")}}},E=()=>{h(null);try{let b=ge(),B=b?b.getCurrentTime():NaN,O=Number.isFinite(B)?Math.max(0,Math.floor(B)):Math.max(0,Mt());Number.isFinite(O)&&Lt(!0)}catch(b){d("Failed to highlight nearest timestamp on play:",b,"warn")}},A=()=>{let b=gt();if(!b)return;let B=ge(),O=B?Math.floor(B.getCurrentTime()):0;Number.isFinite(O)&&(b.paused&&h(O),Lt(!0,O))},x=()=>{let b=l.playbackRate;Da(b),bi(b)};Bo=m,Lo=k,Io=E,Co=A,Do=x,l.addEventListener("timeupdate",m),l.addEventListener("pause",k),l.addEventListener("play",E),l.addEventListener("seeking",A),l.addEventListener("ratechange",x)}let{saveToIndexedDB:Qa,saveSingleTimestampToIndexedDB:gu,deleteSingleTimestampFromIndexedDB:vu,loadFromIndexedDB:yu,removeFromIndexedDB:bu,saveGlobalSettings:Fo,loadGlobalSettings:Ii,buildExportPayload:ku,mergeBackupData:wu,exportAllTimestamps:xu,buildExportCsvPayload:Vm,exportAllTimestampsCsv:Tu}=Ki;function es(){if(!o)return;let l=o.style.display!=="none";Fo("uiVisible",l)}function en(l){let m=typeof l=="boolean"?l:!!o&&o.style.display!=="none",h=document.getElementById("ytls-header-button");h instanceof HTMLButtonElement&&h.setAttribute("aria-pressed",String(m)),bn&&!Eo&&bn.src!==Tt&&(bn.src=Tt)}function Su(){o&&Ii("uiVisible").then(l=>{let m=z.boolean().safeParse(l),h=m.success?m.data:void 0;typeof h=="boolean"?(h?(o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in")):o.style.display="none",en(h)):(!m.success&&l!==void 0&&d("UI visibility state failed validation, defaulting to visible",m.error.format(),"warn"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),en(!0))}).catch(l=>{d("Failed to load UI visibility state:",l,"error"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),en(!0)})}function Ci(l){if(!o){d("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(o)||(d("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(E=>{E!==o&&E.remove()}),document.body.appendChild(o));let m=document.querySelectorAll("#ytls-pane");m.length>1&&(d(`ERROR: Multiple panes detected in togglePaneVisibility (${m.length}), cleaning up`),m.forEach(E=>{E!==o&&E.remove()})),St&&(clearTimeout(St),St=null);let h=o.style.display==="none";(typeof l=="boolean"?l:h)?(o.style.display="flex",o.classList.remove("ytls-fade-out"),o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),en(!0),es(),hn(),Ne&&(clearTimeout(Ne),Ne=null),Ne=setTimeout(()=>{at(),je?.(),Be(),De(!0);try{Lt(!0)}catch(E){d("Failed to scroll to nearest timestamp after toggle:",E,"warn")}Ne=null},450)):(o.classList.remove("ytls-fade-in"),o.classList.remove("ytls-zoom-in"),o.classList.add("ytls-zoom-out"),en(!1),it())}function ts(l){if(!a){d("UI is not initialized; cannot import timestamps.","warn");return}let m=!1;try{let h=JSON.parse(l),k=null;if(Array.isArray(h))k=h;else if(typeof h=="object"&&h!==null){let E=He;if(E){let A=`timekeeper-${E}`;h[A]&&Array.isArray(h[A].timestamps)&&(k=h[A].timestamps,d(`Found timestamps for current video (${E}) in export format`,"info"))}if(!k){let A=Object.keys(h).filter(x=>x.startsWith("ytls-"));if(A.length===1&&Array.isArray(h[A[0]].timestamps)){k=h[A[0]].timestamps;let x=h[A[0]].video_id;d(`Found timestamps for video ${x} in export format`,"info")}}}k&&Array.isArray(k)?k.every(A=>typeof A.start=="number"&&typeof A.comment=="string")?(k.forEach(A=>{if(A.guid){let x=we().find(b=>b.dataset.guid===A.guid);if(x){let b=x.querySelector("input");b&&(b.value=A.comment)}else ro(A.start,A.comment,!1,A.guid)}else ro(A.start,A.comment,!1,crypto.randomUUID())}),m=!0):d("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):d("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!m){let h=l.split(`
`).map(k=>k.trim()).filter(k=>k);if(h.length>0){let k=!1;h.forEach(E=>{let A=E.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(A){k=!0;let x=parseInt(A[1])||0,b=parseInt(A[2]),B=parseInt(A[3]),O=x*3600+b*60+B,U=A[4]?A[4].trim():"",ne=null,fe=U,Se=U.match(/<!--\s*guid:([^>]+?)\s*-->/);Se&&(ne=Se[1].trim(),fe=U.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let lt;if(ne&&(lt=we().find(re=>re.dataset.guid===ne)),!lt&&!ne&&(lt=we().find(re=>{if(re.dataset.guid)return!1;let Xe=re.querySelector("[data-time]")?.dataset.time;if(!Xe)return!1;let Qe=Number.parseInt(Xe,10);return Number.isFinite(Qe)&&Qe===O})),lt){let re=lt.querySelector("input");re&&(re.value=fe)}else ro(O,fe,!1,ne||crypto.randomUUID())}}),k&&(m=!0)}}m?(d("Timestamps changed: Imported timestamps from file/clipboard"),Bt(),Ho(He),Je(),zo()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Eu(){if(Si){d("Pane initialization already in progress, skipping duplicate call");return}if(!(o&&document.body.contains(o))){Si=!0;try{let E=function(f=null,v=null){if(!c)return;let w=gt(),T=v||ge();if(!w&&!T)return;let I=f!==null?f:T?T.getCurrentTime():0,K=Number.isFinite(I)?Math.max(0,Math.floor(I)):Math.max(0,Mt()),{isLive:j}=T?T.getVideoData()||{isLive:!1}:{isLive:!1},q=T?qa(T):!1,N=a?we().map(ae=>{let he=ae.querySelector("[data-time]");return he?parseFloat(he.getAttribute("data-time")??"0"):0}):[],oe="";if(N.length>0)if(j){let ae=Math.max(1,K/60),he=N.filter(Ie=>Ie<=K);if(he.length>0){let Ie=(he.length/ae).toFixed(2);parseFloat(Ie)>0&&(oe=` (${Ie}/min)`)}}else{let ae=T?T.getDuration():0,he=Number.isFinite(ae)&&ae>0?ae:w&&Number.isFinite(w.duration)&&w.duration>0?w.duration:0,Ie=Math.max(1,he/60),It=(N.length/Ie).toFixed(1);parseFloat(It)>0&&(oe=` (${It}/min)`)}c.textContent=`${Ut(K)}${oe}`,c.style.color=q?"#ff4d4f":"",k();try{bi()}catch{}},A=function(){if(ke||$t)return;let f=ge();if(!f)return;let v=f.getCurrentTime(),w=Number.isFinite(v)?Math.max(0,Math.floor(v)):Math.max(0,Mt());E(w,f),(a?we():[]).length>0&&Lt(!1,w)},Ee=function(f,v,w,T){let I=document.createElement("button");return T?ce(I,T,f):I.textContent=f,tt(I,v),I.classList.add("ytls-settings-modal-button"),I.onclick=w,I},Xe=function(f="general"){if(G&&G.parentNode===document.body){let ze=document.getElementById("ytls-save-modal"),An=document.getElementById("ytls-load-modal"),on=document.getElementById("ytls-delete-all-modal");ze&&document.body.contains(ze)&&document.body.removeChild(ze),An&&document.body.contains(An)&&document.body.removeChild(An),on&&document.body.contains(on)&&document.body.removeChild(on),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",xn,!0),document.removeEventListener("keydown",Qe)},300);return}G=document.createElement("div"),G.id="ytls-settings-modal",G.classList.remove("ytls-fade-out"),G.classList.add("ytls-fade-in");let v=document.createElement("div");v.className="ytls-modal-header";let w=document.createElement("div");w.id="ytls-settings-nav";let T=document.createElement("button");T.className="ytls-modal-close-button",Ze(T,"x",14),T.onclick=()=>{if(G&&G.parentNode===document.body){let ze=document.getElementById("ytls-save-modal"),An=document.getElementById("ytls-load-modal"),on=document.getElementById("ytls-delete-all-modal");ze&&document.body.contains(ze)&&document.body.removeChild(ze),An&&document.body.contains(An)&&document.body.removeChild(An),on&&document.body.contains(on)&&document.body.removeChild(on),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",xn,!0),document.removeEventListener("keydown",Qe)},300)}};let I=document.createElement("div");I.id="ytls-settings-content";let K=document.createElement("h3");K.className="ytls-section-heading",K.textContent="General",K.style.display="none";let j=document.createElement("div"),q=document.createElement("div");q.className="ytls-button-grid";let N=document.createElement("div");N.className="ytls-button-grid";function oe(ze){j.style.display=ze==="general"?"block":"none",q.style.display=ze==="google"?"block":"none",N.style.display=ze==="backend"?"block":"none",ae.classList.toggle("active",ze==="general"),Ie.classList.toggle("active",ze==="google"),Ct.classList.toggle("active",ze==="backend"),K.textContent=ze==="general"?"General":ze==="google"?"Google":"Timekeeper Backend"}let ae=document.createElement("button");ae.appendChild(Dr("adjustments-horizontal",16));let he=document.createElement("span");he.className="ytls-tab-text",he.textContent=" General",ae.appendChild(he),tt(ae,"General settings"),ae.classList.add("ytls-settings-modal-button"),ae.onclick=()=>oe("general");let Ie=document.createElement("button");Ie.appendChild(Dr("cloud",16));let It=document.createElement("span");It.className="ytls-tab-text",It.textContent=" Google",Ie.appendChild(It),tt(Ie,"Google Drive backup settings"),Ie.classList.add("ytls-settings-modal-button"),Ie.onclick=async()=>{wt.isSignedIn&&await Oc(),oe("google")};let Ct=document.createElement("button");Ct.appendChild(Dr("server",16));let En=document.createElement("span");En.className="ytls-tab-text",En.textContent=" TKB",Ct.appendChild(En),tt(Ct,"Timekeeper backend backup settings"),Ct.classList.add("ytls-settings-modal-button"),Ct.onclick=()=>oe("backend"),w.appendChild(ae),w.appendChild(Ie),w.appendChild(Ct),v.appendChild(w),v.appendChild(T),G.appendChild(v),j.className="ytls-button-grid",j.appendChild(Ee("Save","Save As...",zn.onclick,"device-floppy")),j.appendChild(Ee("Load","Load",yr.onclick,"folder-open")),j.appendChild(Ee("Export All","Export All Data",Tn.onclick,"file-export")),j.appendChild(Ee("Import All","Import All Data",br.onclick,"file-import")),j.appendChild(Ee("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await Tu()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let nn=Ee(wt.isSignedIn?"Sign Out":"Sign In",wt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{wt.isSignedIn?await Pc():await Dc(),ce(nn,wt.isSignedIn?"logout":"login",wt.isSignedIn?"Sign Out":"Sign In"),tt(nn,wt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),xe()},wt.isSignedIn?"logout":"login"),io=Ee(wo()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await qc(),_n(),xe()},"refresh"),ds=Ee(`Backup Interval: ${Jt()}min`,"Set periodic backup interval (minutes)",async()=>{await Zc(),_n(),xe()},"clock-plus"),ps=Ee(Ur()?"Backend: On":"Backend: Off","Toggle Timekeeper backend backup",async()=>{await Wc(),_n()},"server"),ms=Ee(`Backend Host: ${gi()}`,"Set the Timekeeper backend host",async()=>{await Kc(),_n()},"world"),fs=Ee(`Backend Port: ${lr()}`,"Set the Timekeeper backend port",async()=>{await Yc(),_n()},"plug-connected"),hs=Ee(vi()?"Backend Token: Set":"Backend Token: Missing","Set or clear the Timekeeper backend bearer token",async()=>{await Jc(),_n()},"key"),_n=()=>{ce(nn,wt.isSignedIn?"logout":"login",wt.isSignedIn?"Sign Out":"Sign In"),tt(nn,wt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ce(io,"refresh",wo()?"Auto Backup: On":"Auto Backup: Off"),ce(ds,"clock-plus",`Backup Interval: ${Jt()}min`),ce(ps,"server",Ur()?"Backend: On":"Backend: Off"),ce(ms,"world",`Backend Host: ${gi()}`),ce(fs,"plug-connected",`Backend Port: ${lr()}`),ce(hs,"key",vi()?"Backend Token: Set":"Backend Token: Missing"),typeof xe=="function"&&xe()};q.appendChild(nn),q.appendChild(io),q.appendChild(ds),N.appendChild(ps),N.appendChild(ms),N.appendChild(fs),N.appendChild(hs),q.appendChild(Ee("Backup Now","Run a backup immediately",async()=>{await ko({silent:!1,skipBackoff:!0}),_n()},"database"));let rn=document.createElement("div");rn.style.marginTop="15px",rn.style.paddingTop="10px",rn.style.borderTop="1px solid #555",rn.style.fontSize="12px",rn.style.color="#aaa";let Xo=document.createElement("div");Xo.style.marginBottom="8px",Xo.style.fontWeight="bold",rn.appendChild(Xo),Tc(Xo);let Oi=document.createElement("div");Oi.style.marginBottom="8px",wc(Oi),rn.appendChild(Oi);let gs=document.createElement("div");xc(gs),rn.appendChild(gs),q.appendChild(rn),mt(),qr(),xe(),_n(),I.appendChild(K),I.appendChild(j),I.appendChild(q),I.appendChild(N),oe(f==="drive"?"google":f),G.appendChild(I),document.body.appendChild(G),requestAnimationFrame(()=>{let ze=G.getBoundingClientRect(),on=(window.innerHeight-ze.height)/2;G.style.top=`${Math.max(20,on)}px`,G.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",xn,!0),document.addEventListener("keydown",Qe)},0)},Qe=function(f){if(f.key==="Escape"&&G&&G.parentNode===document.body){let v=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),T=document.getElementById("ytls-delete-all-modal");if(v||w||T)return;f.preventDefault(),v&&document.body.contains(v)&&document.body.removeChild(v),w&&document.body.contains(w)&&document.body.removeChild(w),T&&document.body.contains(T)&&document.body.removeChild(T),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",xn,!0),document.removeEventListener("keydown",Qe)},300)}},xn=function(f){if(So&&So.contains(f.target))return;let v=document.getElementById("ytls-save-modal"),w=document.getElementById("ytls-load-modal"),T=document.getElementById("ytls-delete-all-modal");v&&v.contains(f.target)||w&&w.contains(f.target)||T&&T.contains(f.target)||G&&G.contains(f.target)||(v&&document.body.contains(v)&&document.body.removeChild(v),w&&document.body.contains(w)&&document.body.removeChild(w),T&&document.body.contains(T)&&document.body.removeChild(T),G&&G.parentNode===document.body&&(G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",xn,!0),document.removeEventListener("keydown",Qe)},300)))},oo=function(){o&&(d("Loading window position from IndexedDB"),Ii("windowPosition").then(f=>{let v=hl.safeParse(f);if(v.success){let T=v.data;o.style.left=`${T.x}px`,o.style.top=`${T.y}px`,o.style.right="auto",o.style.bottom="auto",typeof T.width=="number"&&T.width>0?o.style.width=`${T.width}px`:(o.style.width=`${wi}px`,d(`No stored window width found, using default width ${wi}px`)),typeof T.height=="number"&&T.height>0?o.style.height=`${T.height}px`:(o.style.height=`${xi}px`,d(`No stored window height found, using default height ${xi}px`));let I=ot();Fe(I,T.x,T.y),d("Restored window position from IndexedDB:",ye())}else v.success?d("No window position found in IndexedDB, applying default size and leaving default position"):d("Window position in IndexedDB failed validation:",v.error.format(),"warn"),o.style.width=`${wi}px`,o.style.height=`${xi}px`,Y(null);vr();let w=ot();w&&(w.width||w.height)&&Fe(w),je?.()}).catch(f=>{d("failed to load pane position from IndexedDB:",f,"warn"),vr();let v=ot();v&&(v.width||v.height)&&Y({x:Math.max(0,Math.round(v.left)),y:0,width:Math.round(v.width),height:Math.round(v.height)}),je?.()}))},jo=function(){if(!o)return;let f=ot();if(!f)return;let v={x:Math.max(0,Math.round(f.left)),y:Math.max(0,Math.round(f.top)),width:Math.round(f.width),height:Math.round(f.height)},w=ye();if(w&&w.x===v.x&&w.y===v.y&&w.width===v.width&&w.height===v.height){d("Skipping window position save; position and size unchanged");return}Y({...v}),d(`Saving window position and size to IndexedDB: x=${v.x}, y=${v.y}, width=${v.width}, height=${v.height}`),Fo("windowPosition",v),Zr({type:"window_position_updated",position:v,timestamp:Date.now()})},Wo=function(f,v){f.addEventListener("dblclick",w=>{w.preventDefault(),w.stopPropagation(),o&&(o.style.width="300px",o.style.height="300px",jo(),Jo())}),f.addEventListener("mousedown",w=>{w.preventDefault(),w.stopPropagation(),$n=!0,Sn=v,os=w.clientX,is=w.clientY;let T=o.getBoundingClientRect();wr=T.width,xr=T.height,qo=T.left,Zo=T.top,as=document.documentElement.clientWidth,ss=document.documentElement.clientHeight,v==="top-left"||v==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},cs=function(){if(!a||!yn)return;let{scrollTop:f,scrollHeight:v,clientHeight:w}=a;if(v<=w)return;let T=Math.max(30,w/v*w),I=f/(v-w)*(w-T);yn.style.height=`${T}px`,yn.style.top=`${I}px`},us=function(){st&&(Pi===null&&(Pi=requestAnimationFrame(()=>{Pi=null,cs()})),st.classList.add("ytls-scrollbar-visible"),Et&&clearTimeout(Et),Et=setTimeout(()=>{st?.classList.remove("ytls-scrollbar-visible"),Et=null},500))},Jo=function(){if(o&&s&&p&&a){let f=o.getBoundingClientRect(),v=s.getBoundingClientRect(),w=p.getBoundingClientRect(),T=f.height-(v.height+w.height);a.style.maxHeight=T>0?T+"px":"0px",a.style.overflowY=T>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(f=>f.remove()),!document.getElementById("ytls-styles")){let f=document.createElement("style");f.id="ytls-styles",f.textContent=ul,document.head.appendChild(f)}o=document.createElement("div"),s=document.createElement("div"),a=document.createElement("ul"),p=document.createElement("div"),c=document.createElement("span"),y=document.createElement("span"),_=document.createElement("span"),_.classList.add("ytls-backup-indicator"),_.style.cursor="pointer",_.style.backgroundColor="#666",_.onclick=f=>{f.stopPropagation(),Xe("drive")},a.addEventListener("mouseenter",()=>{fr=!0,fo(!0),Qr=!1}),a.addEventListener("mouseleave",()=>{fr=!1,fo(!1);try{Fi()}catch{}if(Qr)return;Lt(!1);let f=null;if(document.activeElement instanceof HTMLInputElement&&a.contains(document.activeElement)&&(f=document.activeElement.closest("li")?.dataset.guid??null),Ya(),f){let w=we().find(T=>T.dataset.guid===f)?.querySelector("input");if(w)try{w.focus({preventScroll:!0})}catch{}}}),o.id="ytls-pane",s.id="ytls-pane-header",s.addEventListener("dblclick",f=>{let v=f.target instanceof Element?f.target:null;if(v){let w=v;for(;w&&w!==o;){if(window.getComputedStyle(w).cursor==="pointer")return;w=w.parentElement}}f.preventDefault(),Ci(!1)});let l=f=>{try{f.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(f=>{o.addEventListener(f,l)}),o.addEventListener("keydown",f=>{try{f.stopPropagation()}catch{}}),o.addEventListener("keyup",f=>{try{f.stopPropagation()}catch{}}),o.addEventListener("focus",f=>{try{f.stopPropagation()}catch{}},!0),o.addEventListener("blur",f=>{try{f.stopPropagation()}catch{}},!0),y.textContent=`v${rr}`,y.classList.add("ytls-version-display");let m=document.createElement("span");m.style.display="inline-flex",m.style.alignItems="center",m.style.gap="6px",m.appendChild(y),m.appendChild(_),c.id="ytls-current-time",c.textContent="\u2014",c.style.cursor="default",tt(c,()=>{let f=ge(),{isLive:v}=f?f.getVideoData()||{isLive:!1}:{isLive:!1};return v?"Skip to live":""}),u=document.createElement("span"),u.id="ytls-playback-speed",u.textContent="1x",u.style.cursor="pointer",u.style.userSelect="none",tt(u,()=>`Current playback speed. Click to toggle between 1x and ${Ca(g)}x.`),u.onclick=()=>{Ra()},u.addEventListener("mousedown",f=>{f.stopPropagation()}),u.addEventListener("click",f=>{f.stopPropagation()}),c.onclick=()=>{let f=ge();if(!f)return;let{isLive:v}=f.getVideoData()||{isLive:!1};v&&($t=!0,f.seekToLiveHead(),setTimeout(()=>{$t=!1},500))};let k=()=>{let f=ge();if(!f){c.style.cursor="default";return}let{isLive:v}=f.getVideoData()||{isLive:!1};c.style.cursor=v?"pointer":"default"};A(),Re&&clearInterval(Re),Re=setInterval(A,1e3),p.id="ytls-buttons";let x=(f,v)=>()=>{f.classList.remove("ytls-fade-in"),f.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(f)&&document.body.removeChild(f),v&&v()},300)},b=f=>v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),f())},B=f=>{setTimeout(()=>{document.addEventListener("keydown",f)},0)},O=(f,v)=>w=>{f.contains(w.target)||v()},U=f=>{setTimeout(()=>{document.addEventListener("click",f,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(Ft())return;let f=typeof mr<"u"?mr:0,v=ge(),w=v?Math.floor(v.getCurrentTime()+f):0;if(!Number.isFinite(w))return;let T=ro(w,"");T&&T.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>Xe()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(f){if(Ft()){Ze(this,"circle-x",20),setTimeout(()=>{Ze(this,"clipboard",20)},2e3);return}let v=Ei(),w=Math.max(Mt(),0);if(v.length===0){Ze(this,"circle-x",20),setTimeout(()=>{Ze(this,"clipboard",20)},2e3);return}let T=f.ctrlKey,I=v.map(K=>{let j=Ut(K.start,w);return T?`${j} ${K.comment} <!-- guid:${K.guid} -->`.trimStart():`${j} ${K.comment}`}).join(`
`);navigator.clipboard.writeText(I).then(()=>{Ze(this,"circle-check",20),setTimeout(()=>{Ze(this,"clipboard",20)},2e3)}).catch(K=>{d("Failed to copy timestamps: ",K,"error"),Ze(this,"circle-x",20),setTimeout(()=>{Ze(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(Ft())return;if(we().length===0){alert("No timestamps available to offset.");return}let v=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(v===null)return;let w=v.trim();if(w.length===0)return;let T=Number.parseInt(w,10);if(!Number.isFinite(T)){alert("Please enter a valid integer number of seconds.");return}T!==0&&Wa(T,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let f=Li();if(!f){alert("Unable to determine current video ID.");return}let v=document.createElement("div");v.id="ytls-delete-all-modal",v.classList.remove("ytls-fade-out"),v.classList.add("ytls-fade-in");let w=document.createElement("p");w.textContent="Hold the button to delete all timestamps for:",w.style.marginBottom="10px";let T=document.createElement("p");T.textContent=f,T.style.fontFamily="monospace",T.style.fontSize="12px",T.style.marginBottom="15px",T.style.color="#aaa";let I=document.createElement("button");I.classList.add("ytls-save-modal-button"),I.style.background="#d32f2f",I.style.position="relative",I.style.overflow="hidden";let K=null,j=0,q=null,N=document.createElement("div");N.style.position="absolute",N.style.left="0",N.style.top="0",N.style.height="100%",N.style.width="0%",N.style.background="#ff6b6b",N.style.transition="none",N.style.pointerEvents="none",I.appendChild(N);let oe=document.createElement("span");oe.textContent="Hold to Delete All",oe.style.position="relative",oe.style.zIndex="1",I.appendChild(oe);let ae=()=>{if(!j)return;let nn=Date.now()-j,io=Math.min(nn/5e3*100,100);N.style.width=`${io}%`,io<100&&(q=requestAnimationFrame(ae))},he=()=>{K&&(clearTimeout(K),K=null),q&&(cancelAnimationFrame(q),q=null),j=0,N.style.width="0%",oe.textContent="Hold to Delete All"};I.onmousedown=()=>{j=Date.now(),oe.textContent="Deleting...",q=requestAnimationFrame(ae),K=setTimeout(async()=>{he(),v.classList.remove("ytls-fade-in"),v.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(v)&&document.body.removeChild(v);try{await bu(f),Di()}catch(nn){d("Failed to delete all timestamps:",nn,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},I.onmouseup=he,I.onmouseleave=he;let Ie=null,It=null,Ct=x(v,()=>{he(),Ie&&document.removeEventListener("keydown",Ie),It&&document.removeEventListener("click",It,!0)});Ie=b(Ct),It=O(v,Ct);let En=document.createElement("button");En.textContent="Cancel",En.classList.add("ytls-save-modal-cancel-button"),En.onclick=Ct,v.appendChild(w),v.appendChild(T),v.appendChild(I),v.appendChild(En),document.body.appendChild(v),B(Ie),U(It)}}].forEach(f=>{let v=document.createElement("button");Ze(v,f.icon,20),tt(v,f.title),v.classList.add("ytls-main-button"),f.id==="copy"?v.onclick=function(w){f.action.call(this,w)}:v.onclick=f.action,f.id==="settings"&&(So=v),p.appendChild(v)});let zn=document.createElement("button");ce(zn,"device-floppy","Save"),zn.classList.add("ytls-file-operation-button"),zn.onclick=()=>{let f=document.createElement("div");f.id="ytls-save-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let v=document.createElement("p");v.textContent="Save as:";let w=null,T=null,I=x(f,()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0)});w=b(I),T=O(f,I);let K=document.createElement("button");K.textContent="JSON",K.classList.add("ytls-save-modal-button"),K.onclick=()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),x(f,()=>Ja("json"))()};let j=document.createElement("button");j.textContent="Plain Text",j.classList.add("ytls-save-modal-button"),j.onclick=()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),x(f,()=>Ja("text"))()};let q=document.createElement("button");q.textContent="Cancel",q.classList.add("ytls-save-modal-cancel-button"),q.onclick=I,f.appendChild(v),f.appendChild(K),f.appendChild(j),f.appendChild(q),document.body.appendChild(f),B(w),U(T)};let yr=document.createElement("button");ce(yr,"folder-open","Load"),yr.classList.add("ytls-file-operation-button"),yr.onclick=()=>{let f=document.createElement("div");f.id="ytls-load-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let v=document.createElement("p");v.textContent="Load from:";let w=null,T=null,I=x(f,()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0)});w=b(I),T=O(f,I);let K=document.createElement("button");K.textContent="File",K.classList.add("ytls-save-modal-button"),K.onclick=()=>{let N=document.createElement("input");N.type="file",N.accept=".json,.txt",N.classList.add("ytls-hidden-file-input"),N.onchange=oe=>{let ae=oe.target.files?.[0];if(!ae)return;w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),I();let he=new FileReader;he.onload=()=>{let Ie=String(he.result).trim();ts(Ie)},he.readAsText(ae)},N.click()};let j=document.createElement("button");j.textContent="Clipboard",j.classList.add("ytls-save-modal-button"),j.onclick=async()=>{w&&document.removeEventListener("keydown",w),T&&document.removeEventListener("click",T,!0),x(f,async()=>{try{let N=await navigator.clipboard.readText();N?ts(N.trim()):alert("Clipboard is empty.")}catch(N){d("Failed to read from clipboard: ",N,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let q=document.createElement("button");q.textContent="Cancel",q.classList.add("ytls-save-modal-cancel-button"),q.onclick=I,f.appendChild(v),f.appendChild(K),f.appendChild(j),f.appendChild(q),document.body.appendChild(f),B(w),U(T)};let Tn=document.createElement("button");ce(Tn,"file-export","Export"),Tn.classList.add("ytls-file-operation-button"),Tn.onclick=async()=>{try{await xu()}catch{alert("Failed to export data: Could not read from database.")}};let br=document.createElement("button");ce(br,"file-import","Import"),br.classList.add("ytls-file-operation-button"),br.onclick=()=>{let f=document.createElement("input");f.type="file",f.accept=".json",f.classList.add("ytls-hidden-file-input"),f.onchange=v=>{let w=v.target.files?.[0];if(!w)return;let T=new FileReader;T.onload=()=>{try{let I=JSON.parse(String(T.result)),K=[];for(let j in I)if(Object.prototype.hasOwnProperty.call(I,j)&&j.startsWith("ytls-")){let q=j.substring(5),N=I[j];if(N&&typeof N.video_id=="string"&&Array.isArray(N.timestamps)){let oe=N.timestamps.map(he=>({...he,guid:he.guid||crypto.randomUUID()})),ae=Qa(q,oe).then(()=>d(`Imported ${q} to IndexedDB`)).catch(he=>d(`Failed to import ${q} to IndexedDB:`,he,"error"));K.push(ae)}else d(`Skipping key ${j} during import due to unexpected data format.`,"warn")}Promise.all(K).then(()=>{Di()}).catch(j=>{alert("An error occurred during import to IndexedDB. Check console for details."),d("Overall import error:",j,"error")})}catch(I){alert(`Failed to import data. Please ensure the file is in the correct format.
`+I.message),d("Import error:",I,"error")}},T.readAsText(w)},f.click()},a.onclick=f=>{Ka(f)},a.ontouchstart=f=>{Ka(f)},o.style.position="fixed",o.style.bottom="0",o.style.right="0",o.style.transition="none",oo(),setTimeout(()=>vr(),10);let tn=!1,Vo=0,Go=0,Hn=0,Uo=0,Q=0,ee=0,pe=null,ue=!1;o.addEventListener("mousedown",f=>{let v=f.target;if(!(v instanceof Element)||v instanceof HTMLInputElement||v instanceof HTMLTextAreaElement||v instanceof Element&&(v.closest("#ytls-playback-speed-group")||v.closest("#ytls-playback-speed"))||v!==s&&!s.contains(v)&&window.getComputedStyle(v).cursor==="pointer")return;tn=!0,ue=!1;let w=o.getBoundingClientRect();Vo=f.clientX-w.left,Go=f.clientY-w.top,Hn=w.width,Uo=w.height,Q=document.documentElement.clientWidth,ee=document.documentElement.clientHeight,o.style.transition="none"}),document.addEventListener("mousemove",_o=f=>{if(!tn)return;ue=!0;let v=f.clientX,w=f.clientY;pe===null&&(pe=requestAnimationFrame(()=>{if(pe=null,!tn)return;let T=Math.max(0,Math.min(v-Vo,Q-Hn)),I=Math.max(0,Math.min(w-Go,ee-Uo));o.style.left=`${T}px`,o.style.top=`${I}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",Ao=()=>{if(!tn)return;tn=!1,pe!==null&&(cancelAnimationFrame(pe),pe=null);let f=ue;setTimeout(()=>{ue=!1},50),vr(),setTimeout(()=>{f&&jo()},200)}),o.addEventListener("dragstart",f=>f.preventDefault());let Le=document.createElement("div"),et=document.createElement("div"),vt=document.createElement("div"),kr=document.createElement("div");Le.id="ytls-resize-tl",et.id="ytls-resize-tr",vt.id="ytls-resize-bl",kr.id="ytls-resize-br";let $n=!1,os=0,is=0,wr=0,xr=0,qo=0,Zo=0,as=0,ss=0,Tr=null,Sn=null;Wo(Le,"top-left"),Wo(et,"top-right"),Wo(vt,"bottom-left"),Wo(kr,"bottom-right"),document.addEventListener("mousemove",f=>{if(!$n||!o||!Sn)return;let v=f.clientX,w=f.clientY;Tr===null&&(Tr=requestAnimationFrame(()=>{if(Tr=null,!$n||!o||!Sn)return;let T=v-os,I=w-is,K=as,j=ss,q=wr,N=xr,oe=qo,ae=Zo;Sn==="bottom-right"?(q=Math.max(200,Math.min(800,wr+T)),N=Math.max(250,Math.min(j,xr+I))):Sn==="top-left"?(q=Math.max(200,Math.min(800,wr-T)),oe=qo+T,N=Math.max(250,Math.min(j,xr-I)),ae=Zo+I):Sn==="top-right"?(q=Math.max(200,Math.min(800,wr+T)),N=Math.max(250,Math.min(j,xr-I)),ae=Zo+I):Sn==="bottom-left"&&(q=Math.max(200,Math.min(800,wr-T)),oe=qo+T,N=Math.max(250,Math.min(j,xr+I))),oe=Math.max(0,Math.min(oe,K-q)),ae=Math.max(0,Math.min(ae,j-N)),o.style.width=`${q}px`,o.style.height=`${N}px`,o.style.left=`${oe}px`,o.style.top=`${ae}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{$n&&($n=!1,Tr!==null&&(cancelAnimationFrame(Tr),Tr=null),Sn=null,document.body.style.cursor="",De(!0))});let Ko=null;window.addEventListener("resize",Mo=()=>{Ko&&clearTimeout(Ko),Ko=setTimeout(()=>{De(!0),je?.(),Ko=null},200)}),s.appendChild(c);let Sr=document.createElement("span");Sr.id="ytls-playback-speed-group",Sr.style.display="inline-flex",Sr.style.alignItems="center",Sr.style.marginLeft="4px",u&&Sr.appendChild(u),s.appendChild(Sr),s.appendChild(m);let Ri=document.createElement("div");Ri.id="ytls-list-wrapper",st=document.createElement("div"),st.className="ytls-scrollbar-track",yn=document.createElement("div"),yn.className="ytls-scrollbar-thumb",st.append(yn),Ri.append(a,st);let Yo=document.createElement("div");Yo.id="ytls-content",Yo.append(Ri),Yo.append(p),o.append(s,Yo,Le,et,vt,kr);let ls="";o.addEventListener("mousemove",f=>{if(tn||$n)return;let v=o.getBoundingClientRect(),w=20,T=f.clientX,I=f.clientY,K=T-v.left<=w,j=v.right-T<=w,q=I-v.top<=w,N=v.bottom-I<=w,oe="";q&&K||N&&j?oe="nwse-resize":(q&&j||N&&K)&&(oe="nesw-resize"),oe!==ls&&(ls=oe,document.body.style.cursor=oe)});let Pi=null;if(st.addEventListener("mouseenter",()=>{Et&&(clearTimeout(Et),Et=null),st.classList.add("ytls-scrollbar-visible")}),st.addEventListener("mouseleave",()=>{Ti||(Et=setTimeout(()=>{st?.classList.remove("ytls-scrollbar-visible"),Et=null},500))}),yn.addEventListener("mousedown",f=>{if(!a)return;f.preventDefault(),f.stopPropagation(),Ti=!0;let v=f.clientY,w=a.scrollTop,{scrollHeight:T,clientHeight:I}=a,K=Math.max(30,I/T*I),j=T-I,q=I-K;function N(ae){if(!a)return;let he=ae.clientY-v;a.scrollTop=Math.max(0,Math.min(j,w+he*(j/q))),cs()}function oe(){Ti=!1,document.removeEventListener("mousemove",N),document.removeEventListener("mouseup",oe),st?.matches(":hover")||(Et=setTimeout(()=>{st?.classList.remove("ytls-scrollbar-visible"),Et=null},500))}document.addEventListener("mousemove",N),document.addEventListener("mouseup",oe)}),o.addEventListener("mouseenter",()=>{fr=!0,fo(!0),us()}),a.addEventListener("scroll",us),o.addEventListener("mouseleave",()=>{!$n&&!tn&&(document.body.style.cursor=""),fr=!1,fo(!1);try{Fi()}catch{}try{Lt(!1)}catch{}}),je=Jo,setTimeout(()=>{if(Jo(),o&&s&&p&&a){let f=40,v=we();if(v.length>0)f=v[0].offsetHeight;else{let w=document.createElement("li");w.style.visibility="hidden",w.style.position="absolute",w.textContent="00:00 Example",a.appendChild(w),f=w.offsetHeight,a.removeChild(w)}C(s.offsetHeight+p.offsetHeight+f),o.style.minHeight=X()+"px"}},0),At){try{At.disconnect()}catch{}At=null}At=new ResizeObserver(Jo),At.observe(o),Jr||document.addEventListener("pointerdown",Jr=()=>{$a=Date.now()},!0),Xr||document.addEventListener("pointerup",Xr=()=>{},!0)}finally{Si=!1}}}async function _u(){if(!o)return;if(document.querySelectorAll("#ytls-pane").forEach(h=>{h!==o&&(d("Removing duplicate pane element from DOM"),h.remove())}),document.body.contains(o)){d("Pane already in DOM, skipping append");return}await Su(),Ac(ku),Mc(wu),Sa(Fo),Ea(Ii),Bc(Bi),Sc(_),await _a(),await Gc(),await xt(),Ma();let m=document.querySelectorAll("#ytls-pane");if(m.length>0&&(d(`WARNING: Found ${m.length} existing pane(s) in DOM, removing all`),m.forEach(h=>h.remove())),document.body.contains(o)){d("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(o),d("Pane successfully appended to DOM"),hn(),Ne&&(clearTimeout(Ne),Ne=null),Ne=setTimeout(()=>{at(),je?.(),Be(),De(!0),Ne=null},450),_t){try{_t.disconnect()}catch{}_t=null}_t=new MutationObserver(()=>{let h=document.querySelectorAll("#ytls-pane");h.length>1&&(d(`CRITICAL: Multiple panes detected (${h.length}), removing duplicates`),h.forEach((k,E)=>{(E>0||o&&k!==o)&&k.remove()}))}),_t.observe(document.body,{childList:!0})}function ns(l=0){if(document.getElementById("ytls-header-button")){en();return}let m=document.querySelector("#logo");if(!m||!m.parentElement){l<10&&setTimeout(()=>ns(l+1),300);return}let h=document.createElement("button");h.id="ytls-header-button",h.type="button",h.className="ytls-header-button",tt(h,"Toggle Timekeeper UI"),h.setAttribute("aria-label","Toggle Timekeeper UI");let k=document.createElement("img");k.src=Tt,k.alt="",k.decoding="async",h.appendChild(k),bn=k,h.addEventListener("mouseenter",()=>{bn&&(Eo=!0,bn.src=Xt)}),h.addEventListener("mouseleave",()=>{bn&&(Eo=!1,en())}),h.addEventListener("click",()=>{o&&!document.body.contains(o)&&(d("Pane not in DOM, re-appending before toggle"),document.body.appendChild(o)),Ci()}),m.insertAdjacentElement("afterend",h),en(),d("Timekeeper header button added next to YouTube logo")}function rs(){if(de())return;Ae(!0);let l=history.pushState,m=history.replaceState;function h(){try{let k=new Event("locationchange");window.dispatchEvent(k)}catch{}}history.pushState=function(){let k=l.apply(this,arguments);return h(),k},history.replaceState=function(){let k=m.apply(this,arguments);return h(),k},window.addEventListener("popstate",h),window.addEventListener("locationchange",()=>{window.location.href!==V&&d("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function Di(){if(!i()){pu();return}ie(window.location.href),document.querySelectorAll("#ytls-pane").forEach((m,h)=>{(h>0||o&&m!==o)&&m.remove()}),await dr(),await Eu(),He=Li();let l=document.title;d("Page Title:",l),d("Video ID:",He),d("Current URL:",window.location.href),Ai(!0),to(),Je(),await Bi(),Je(),Ai(!1),d("Timestamps loaded and UI unlocked for video:",He),await _u();try{Lt(!0)}catch{}ns(),hu()}rs(),window.addEventListener("yt-navigate-start",()=>{d("Navigation started (yt-navigate-start event fired)"),i()&&o&&a&&(d("Locking UI and showing loading state for navigation"),Ai(!0))}),Yr=l=>{if(!l.repeat&&!l.ctrlKey&&!l.altKey&&!l.metaKey&&!l.shiftKey&&(l.key==="z"||l.key==="Z")){if(Qc(l.target))return;Ra()&&(l.preventDefault(),d("Playback speed toggled via keyboard shortcut (Z)"));return}l.ctrlKey&&l.altKey&&l.shiftKey&&(l.key==="T"||l.key==="t")&&(l.preventDefault(),Ci(),d("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",Yr),window.addEventListener("yt-navigate-finish",()=>{d("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==V?Di():d("Navigation finished but URL already handled, skipping.")}),rs(),d("Timekeeper initialized and waiting for navigation events")})();})();

