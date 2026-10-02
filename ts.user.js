// ==UserScript==
// @name         Timekeeper
// @namespace    https://violentmonkey.github.io/
// @version      5.0.22
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

(()=>{var tu=Object.defineProperty;var Xa=(t,e)=>{for(var n in e)tu(t,n,{get:e[n],enumerable:!0})};var U={};Xa(U,{BRAND:()=>Au,DIRTY:()=>Nn,EMPTY_PATH:()=>iu,INVALID:()=>z,NEVER:()=>dd,OK:()=>Ze,ParseStatus:()=>Ve,Schema:()=>K,ZodAny:()=>kn,ZodArray:()=>on,ZodBigInt:()=>Hn,ZodBoolean:()=>$n,ZodBranded:()=>Kr,ZodCatch:()=>Jn,ZodDate:()=>Fn,ZodDefault:()=>Kn,ZodDiscriminatedUnion:()=>qo,ZodEffects:()=>xt,ZodEnum:()=>Wn,ZodError:()=>st,ZodFirstPartyTypeKind:()=>H,ZodFunction:()=>Wo,ZodIntersection:()=>Gn,ZodIssueCode:()=>S,ZodLazy:()=>qn,ZodLiteral:()=>Zn,ZodMap:()=>Tr,ZodNaN:()=>Er,ZodNativeEnum:()=>Yn,ZodNever:()=>Dt,ZodNull:()=>Vn,ZodNullable:()=>jt,ZodNumber:()=>zn,ZodObject:()=>lt,ZodOptional:()=>bt,ZodParsedType:()=>I,ZodPipeline:()=>Jr,ZodPromise:()=>Tn,ZodReadonly:()=>Xn,ZodRecord:()=>Zo,ZodSchema:()=>K,ZodSet:()=>Sr,ZodString:()=>xn,ZodSymbol:()=>xr,ZodTransformer:()=>xt,ZodTuple:()=>Ft,ZodType:()=>K,ZodUndefined:()=>jn,ZodUnion:()=>Un,ZodUnknown:()=>rn,ZodVoid:()=>kr,addIssueToContext:()=>M,any:()=>Ou,array:()=>$u,bigint:()=>Cu,boolean:()=>cs,coerce:()=>ud,custom:()=>as,date:()=>Du,datetimeRegex:()=>os,defaultErrorMap:()=>tn,discriminatedUnion:()=>Uu,effect:()=>nd,enum:()=>Qu,function:()=>Ku,getErrorMap:()=>yr,getParsedType:()=>$t,instanceof:()=>Lu,intersection:()=>Gu,isAborted:()=>Uo,isAsync:()=>br,isDirty:()=>Go,isValid:()=>wn,late:()=>Mu,lazy:()=>Ju,literal:()=>Xu,makeIssue:()=>Yr,map:()=>Wu,nan:()=>Iu,nativeEnum:()=>ed,never:()=>zu,null:()=>Pu,nullable:()=>od,number:()=>ls,object:()=>Fu,objectUtil:()=>Ai,oboolean:()=>cd,onumber:()=>ld,optional:()=>rd,ostring:()=>sd,pipeline:()=>ad,preprocess:()=>id,promise:()=>td,quotelessJson:()=>nu,record:()=>Zu,set:()=>Yu,setErrorMap:()=>ou,strictObject:()=>ju,string:()=>ss,symbol:()=>Bu,transformer:()=>nd,tuple:()=>qu,undefined:()=>Ru,union:()=>Vu,unknown:()=>Nu,util:()=>ne,void:()=>Hu});var ne;(function(t){t.assertEqual=i=>{};function e(i){}t.assertIs=e;function n(i){throw new Error}t.assertNever=n,t.arrayToEnum=i=>{let o={};for(let s of i)o[s]=s;return o},t.getValidEnumValues=i=>{let o=t.objectKeys(i).filter(a=>typeof i[i[a]]!="number"),s={};for(let a of o)s[a]=i[a];return t.objectValues(s)},t.objectValues=i=>t.objectKeys(i).map(function(o){return i[o]}),t.objectKeys=typeof Object.keys=="function"?i=>Object.keys(i):i=>{let o=[];for(let s in i)Object.prototype.hasOwnProperty.call(i,s)&&o.push(s);return o},t.find=(i,o)=>{for(let s of i)if(o(s))return s},t.isInteger=typeof Number.isInteger=="function"?i=>Number.isInteger(i):i=>typeof i=="number"&&Number.isFinite(i)&&Math.floor(i)===i;function r(i,o=" | "){return i.map(s=>typeof s=="string"?`'${s}'`:s).join(o)}t.joinValues=r,t.jsonStringifyReplacer=(i,o)=>typeof o=="bigint"?o.toString():o})(ne||(ne={}));var Ai;(function(t){t.mergeShapes=(e,n)=>({...e,...n})})(Ai||(Ai={}));var I=ne.arrayToEnum(["string","nan","number","integer","float","boolean","date","bigint","symbol","function","undefined","null","array","object","unknown","promise","void","never","map","set"]),$t=t=>{switch(typeof t){case"undefined":return I.undefined;case"string":return I.string;case"number":return Number.isNaN(t)?I.nan:I.number;case"boolean":return I.boolean;case"function":return I.function;case"bigint":return I.bigint;case"symbol":return I.symbol;case"object":return Array.isArray(t)?I.array:t===null?I.null:t.then&&typeof t.then=="function"&&t.catch&&typeof t.catch=="function"?I.promise:typeof Map<"u"&&t instanceof Map?I.map:typeof Set<"u"&&t instanceof Set?I.set:typeof Date<"u"&&t instanceof Date?I.date:I.object;default:return I.unknown}};var S=ne.arrayToEnum(["invalid_type","invalid_literal","custom","invalid_union","invalid_union_discriminator","invalid_enum_value","unrecognized_keys","invalid_arguments","invalid_return_type","invalid_date","invalid_string","too_small","too_big","invalid_intersection_types","not_multiple_of","not_finite"]),nu=t=>JSON.stringify(t,null,2).replace(/"([^"]+)":/g,"$1:"),st=class t extends Error{get errors(){return this.issues}constructor(e){super(),this.issues=[],this.addIssue=r=>{this.issues=[...this.issues,r]},this.addIssues=(r=[])=>{this.issues=[...this.issues,...r]};let n=new.target.prototype;Object.setPrototypeOf?Object.setPrototypeOf(this,n):this.__proto__=n,this.name="ZodError",this.issues=e}format(e){let n=e||function(o){return o.message},r={_errors:[]},i=o=>{for(let s of o.issues)if(s.code==="invalid_union")s.unionErrors.map(i);else if(s.code==="invalid_return_type")i(s.returnTypeError);else if(s.code==="invalid_arguments")i(s.argumentsError);else if(s.path.length===0)r._errors.push(n(s));else{let a=r,p=0;for(;p<s.path.length;){let c=s.path[p];p===s.path.length-1?(a[c]=a[c]||{_errors:[]},a[c]._errors.push(n(s))):a[c]=a[c]||{_errors:[]},a=a[c],p++}}};return i(this),r}static assert(e){if(!(e instanceof t))throw new Error(`Not a ZodError: ${e}`)}toString(){return this.message}get message(){return JSON.stringify(this.issues,ne.jsonStringifyReplacer,2)}get isEmpty(){return this.issues.length===0}flatten(e=n=>n.message){let n={},r=[];for(let i of this.issues)if(i.path.length>0){let o=i.path[0];n[o]=n[o]||[],n[o].push(e(i))}else r.push(e(i));return{formErrors:r,fieldErrors:n}}get formErrors(){return this.flatten()}};st.create=t=>new st(t);var ru=(t,e)=>{let n;switch(t.code){case S.invalid_type:t.received===I.undefined?n="Required":n=`Expected ${t.expected}, received ${t.received}`;break;case S.invalid_literal:n=`Invalid literal value, expected ${JSON.stringify(t.expected,ne.jsonStringifyReplacer)}`;break;case S.unrecognized_keys:n=`Unrecognized key(s) in object: ${ne.joinValues(t.keys,", ")}`;break;case S.invalid_union:n="Invalid input";break;case S.invalid_union_discriminator:n=`Invalid discriminator value. Expected ${ne.joinValues(t.options)}`;break;case S.invalid_enum_value:n=`Invalid enum value. Expected ${ne.joinValues(t.options)}, received '${t.received}'`;break;case S.invalid_arguments:n="Invalid function arguments";break;case S.invalid_return_type:n="Invalid function return type";break;case S.invalid_date:n="Invalid date";break;case S.invalid_string:typeof t.validation=="object"?"includes"in t.validation?(n=`Invalid input: must include "${t.validation.includes}"`,typeof t.validation.position=="number"&&(n=`${n} at one or more positions greater than or equal to ${t.validation.position}`)):"startsWith"in t.validation?n=`Invalid input: must start with "${t.validation.startsWith}"`:"endsWith"in t.validation?n=`Invalid input: must end with "${t.validation.endsWith}"`:ne.assertNever(t.validation):t.validation!=="regex"?n=`Invalid ${t.validation}`:n="Invalid";break;case S.too_small:t.type==="array"?n=`Array must contain ${t.exact?"exactly":t.inclusive?"at least":"more than"} ${t.minimum} element(s)`:t.type==="string"?n=`String must contain ${t.exact?"exactly":t.inclusive?"at least":"over"} ${t.minimum} character(s)`:t.type==="number"?n=`Number must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${t.minimum}`:t.type==="bigint"?n=`Number must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${t.minimum}`:t.type==="date"?n=`Date must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(t.minimum))}`:n="Invalid input";break;case S.too_big:t.type==="array"?n=`Array must contain ${t.exact?"exactly":t.inclusive?"at most":"less than"} ${t.maximum} element(s)`:t.type==="string"?n=`String must contain ${t.exact?"exactly":t.inclusive?"at most":"under"} ${t.maximum} character(s)`:t.type==="number"?n=`Number must be ${t.exact?"exactly":t.inclusive?"less than or equal to":"less than"} ${t.maximum}`:t.type==="bigint"?n=`BigInt must be ${t.exact?"exactly":t.inclusive?"less than or equal to":"less than"} ${t.maximum}`:t.type==="date"?n=`Date must be ${t.exact?"exactly":t.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(t.maximum))}`:n="Invalid input";break;case S.custom:n="Invalid input";break;case S.invalid_intersection_types:n="Intersection results could not be merged";break;case S.not_multiple_of:n=`Number must be a multiple of ${t.multipleOf}`;break;case S.not_finite:n="Number must be finite";break;default:n=e.defaultError,ne.assertNever(t)}return{message:n}},tn=ru;var Qa=tn;function ou(t){Qa=t}function yr(){return Qa}var Yr=t=>{let{data:e,path:n,errorMaps:r,issueData:i}=t,o=[...n,...i.path||[]],s={...i,path:o};if(i.message!==void 0)return{...i,path:o,message:i.message};let a="",p=r.filter(c=>!!c).slice().reverse();for(let c of p)a=c(s,{data:e,defaultError:a}).message;return{...i,path:o,message:a}},iu=[];function M(t,e){let n=yr(),r=Yr({issueData:e,data:t.data,path:t.path,errorMaps:[t.common.contextualErrorMap,t.schemaErrorMap,n,n===tn?void 0:tn].filter(i=>!!i)});t.common.issues.push(r)}var Ve=class t{constructor(){this.value="valid"}dirty(){this.value==="valid"&&(this.value="dirty")}abort(){this.value!=="aborted"&&(this.value="aborted")}static mergeArray(e,n){let r=[];for(let i of n){if(i.status==="aborted")return z;i.status==="dirty"&&e.dirty(),r.push(i.value)}return{status:e.value,value:r}}static async mergeObjectAsync(e,n){let r=[];for(let i of n){let o=await i.key,s=await i.value;r.push({key:o,value:s})}return t.mergeObjectSync(e,r)}static mergeObjectSync(e,n){let r={};for(let i of n){let{key:o,value:s}=i;if(o.status==="aborted"||s.status==="aborted")return z;o.status==="dirty"&&e.dirty(),s.status==="dirty"&&e.dirty(),o.value!=="__proto__"&&(typeof s.value<"u"||i.alwaysSet)&&(r[o.value]=s.value)}return{status:e.value,value:r}}},z=Object.freeze({status:"aborted"}),Nn=t=>({status:"dirty",value:t}),Ze=t=>({status:"valid",value:t}),Uo=t=>t.status==="aborted",Go=t=>t.status==="dirty",wn=t=>t.status==="valid",br=t=>typeof Promise<"u"&&t instanceof Promise;var P;(function(t){t.errToObj=e=>typeof e=="string"?{message:e}:e||{},t.toString=e=>typeof e=="string"?e:e?.message})(P||(P={}));var wt=class{constructor(e,n,r,i){this._cachedPath=[],this.parent=e,this.data=n,this._path=r,this._key=i}get path(){return this._cachedPath.length||(Array.isArray(this._key)?this._cachedPath.push(...this._path,...this._key):this._cachedPath.push(...this._path,this._key)),this._cachedPath}},es=(t,e)=>{if(wn(e))return{success:!0,data:e.value};if(!t.common.issues.length)throw new Error("Validation failed but no issues detected.");return{success:!1,get error(){if(this._error)return this._error;let n=new st(t.common.issues);return this._error=n,this._error}}};function W(t){if(!t)return{};let{errorMap:e,invalid_type_error:n,required_error:r,description:i}=t;if(e&&(n||r))throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);return e?{errorMap:e,description:i}:{errorMap:(s,a)=>{let{message:p}=t;return s.code==="invalid_enum_value"?{message:p??a.defaultError}:typeof a.data>"u"?{message:p??r??a.defaultError}:s.code!=="invalid_type"?{message:a.defaultError}:{message:p??n??a.defaultError}},description:i}}var K=class{get description(){return this._def.description}_getType(e){return $t(e.data)}_getOrReturnCtx(e,n){return n||{common:e.parent.common,data:e.data,parsedType:$t(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}_processInputParams(e){return{status:new Ve,ctx:{common:e.parent.common,data:e.data,parsedType:$t(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}}_parseSync(e){let n=this._parse(e);if(br(n))throw new Error("Synchronous parse encountered promise.");return n}_parseAsync(e){let n=this._parse(e);return Promise.resolve(n)}parse(e,n){let r=this.safeParse(e,n);if(r.success)return r.data;throw r.error}safeParse(e,n){let r={common:{issues:[],async:n?.async??!1,contextualErrorMap:n?.errorMap},path:n?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:$t(e)},i=this._parseSync({data:e,path:r.path,parent:r});return es(r,i)}"~validate"(e){let n={common:{issues:[],async:!!this["~standard"].async},path:[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:$t(e)};if(!this["~standard"].async)try{let r=this._parseSync({data:e,path:[],parent:n});return wn(r)?{value:r.value}:{issues:n.common.issues}}catch(r){r?.message?.toLowerCase()?.includes("encountered")&&(this["~standard"].async=!0),n.common={issues:[],async:!0}}return this._parseAsync({data:e,path:[],parent:n}).then(r=>wn(r)?{value:r.value}:{issues:n.common.issues})}async parseAsync(e,n){let r=await this.safeParseAsync(e,n);if(r.success)return r.data;throw r.error}async safeParseAsync(e,n){let r={common:{issues:[],contextualErrorMap:n?.errorMap,async:!0},path:n?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:$t(e)},i=this._parse({data:e,path:r.path,parent:r}),o=await(br(i)?i:Promise.resolve(i));return es(r,o)}refine(e,n){let r=i=>typeof n=="string"||typeof n>"u"?{message:n}:typeof n=="function"?n(i):n;return this._refinement((i,o)=>{let s=e(i),a=()=>o.addIssue({code:S.custom,...r(i)});return typeof Promise<"u"&&s instanceof Promise?s.then(p=>p?!0:(a(),!1)):s?!0:(a(),!1)})}refinement(e,n){return this._refinement((r,i)=>e(r)?!0:(i.addIssue(typeof n=="function"?n(r,i):n),!1))}_refinement(e){return new xt({schema:this,typeName:H.ZodEffects,effect:{type:"refinement",refinement:e}})}superRefine(e){return this._refinement(e)}constructor(e){this.spa=this.safeParseAsync,this._def=e,this.parse=this.parse.bind(this),this.safeParse=this.safeParse.bind(this),this.parseAsync=this.parseAsync.bind(this),this.safeParseAsync=this.safeParseAsync.bind(this),this.spa=this.spa.bind(this),this.refine=this.refine.bind(this),this.refinement=this.refinement.bind(this),this.superRefine=this.superRefine.bind(this),this.optional=this.optional.bind(this),this.nullable=this.nullable.bind(this),this.nullish=this.nullish.bind(this),this.array=this.array.bind(this),this.promise=this.promise.bind(this),this.or=this.or.bind(this),this.and=this.and.bind(this),this.transform=this.transform.bind(this),this.brand=this.brand.bind(this),this.default=this.default.bind(this),this.catch=this.catch.bind(this),this.describe=this.describe.bind(this),this.pipe=this.pipe.bind(this),this.readonly=this.readonly.bind(this),this.isNullable=this.isNullable.bind(this),this.isOptional=this.isOptional.bind(this),this["~standard"]={version:1,vendor:"zod",validate:n=>this["~validate"](n)}}optional(){return bt.create(this,this._def)}nullable(){return jt.create(this,this._def)}nullish(){return this.nullable().optional()}array(){return on.create(this)}promise(){return Tn.create(this,this._def)}or(e){return Un.create([this,e],this._def)}and(e){return Gn.create(this,e,this._def)}transform(e){return new xt({...W(this._def),schema:this,typeName:H.ZodEffects,effect:{type:"transform",transform:e}})}default(e){let n=typeof e=="function"?e:()=>e;return new Kn({...W(this._def),innerType:this,defaultValue:n,typeName:H.ZodDefault})}brand(){return new Kr({typeName:H.ZodBranded,type:this,...W(this._def)})}catch(e){let n=typeof e=="function"?e:()=>e;return new Jn({...W(this._def),innerType:this,catchValue:n,typeName:H.ZodCatch})}describe(e){let n=this.constructor;return new n({...this._def,description:e})}pipe(e){return Jr.create(this,e)}readonly(){return Xn.create(this)}isOptional(){return this.safeParse(void 0).success}isNullable(){return this.safeParse(null).success}},au=/^c[^\s-]{8,}$/i,su=/^[0-9a-z]+$/,lu=/^[0-9A-HJKMNP-TV-Z]{26}$/i,cu=/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,uu=/^[a-z0-9_-]{21}$/i,du=/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,pu=/^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,mu=/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,fu="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",Mi,hu=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,gu=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,vu=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,yu=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,bu=/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,wu=/^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,ns="((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",xu=new RegExp(`^${ns}$`);function rs(t){let e="[0-5]\\d";t.precision?e=`${e}\\.\\d{${t.precision}}`:t.precision==null&&(e=`${e}(\\.\\d+)?`);let n=t.precision?"+":"?";return`([01]\\d|2[0-3]):[0-5]\\d(:${e})${n}`}function ku(t){return new RegExp(`^${rs(t)}$`)}function os(t){let e=`${ns}T${rs(t)}`,n=[];return n.push(t.local?"Z?":"Z"),t.offset&&n.push("([+-]\\d{2}:?\\d{2})"),e=`${e}(${n.join("|")})`,new RegExp(`^${e}$`)}function Tu(t,e){return!!((e==="v4"||!e)&&hu.test(t)||(e==="v6"||!e)&&vu.test(t))}function Su(t,e){if(!du.test(t))return!1;try{let[n]=t.split(".");if(!n)return!1;let r=n.replace(/-/g,"+").replace(/_/g,"/").padEnd(n.length+(4-n.length%4)%4,"="),i=JSON.parse(atob(r));return!(typeof i!="object"||i===null||"typ"in i&&i?.typ!=="JWT"||!i.alg||e&&i.alg!==e)}catch{return!1}}function Eu(t,e){return!!((e==="v4"||!e)&&gu.test(t)||(e==="v6"||!e)&&yu.test(t))}var xn=class t extends K{_parse(e){if(this._def.coerce&&(e.data=String(e.data)),this._getType(e)!==I.string){let o=this._getOrReturnCtx(e);return M(o,{code:S.invalid_type,expected:I.string,received:o.parsedType}),z}let r=new Ve,i;for(let o of this._def.checks)if(o.kind==="min")e.data.length<o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:S.too_small,minimum:o.value,type:"string",inclusive:!0,exact:!1,message:o.message}),r.dirty());else if(o.kind==="max")e.data.length>o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:S.too_big,maximum:o.value,type:"string",inclusive:!0,exact:!1,message:o.message}),r.dirty());else if(o.kind==="length"){let s=e.data.length>o.value,a=e.data.length<o.value;(s||a)&&(i=this._getOrReturnCtx(e,i),s?M(i,{code:S.too_big,maximum:o.value,type:"string",inclusive:!0,exact:!0,message:o.message}):a&&M(i,{code:S.too_small,minimum:o.value,type:"string",inclusive:!0,exact:!0,message:o.message}),r.dirty())}else if(o.kind==="email")mu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"email",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="emoji")Mi||(Mi=new RegExp(fu,"u")),Mi.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"emoji",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="uuid")cu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"uuid",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="nanoid")uu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"nanoid",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="cuid")au.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"cuid",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="cuid2")su.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"cuid2",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="ulid")lu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"ulid",code:S.invalid_string,message:o.message}),r.dirty());else if(o.kind==="url")try{new URL(e.data)}catch{i=this._getOrReturnCtx(e,i),M(i,{validation:"url",code:S.invalid_string,message:o.message}),r.dirty()}else o.kind==="regex"?(o.regex.lastIndex=0,o.regex.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"regex",code:S.invalid_string,message:o.message}),r.dirty())):o.kind==="trim"?e.data=e.data.trim():o.kind==="includes"?e.data.includes(o.value,o.position)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:{includes:o.value,position:o.position},message:o.message}),r.dirty()):o.kind==="toLowerCase"?e.data=e.data.toLowerCase():o.kind==="toUpperCase"?e.data=e.data.toUpperCase():o.kind==="startsWith"?e.data.startsWith(o.value)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:{startsWith:o.value},message:o.message}),r.dirty()):o.kind==="endsWith"?e.data.endsWith(o.value)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:{endsWith:o.value},message:o.message}),r.dirty()):o.kind==="datetime"?os(o).test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:"datetime",message:o.message}),r.dirty()):o.kind==="date"?xu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:"date",message:o.message}),r.dirty()):o.kind==="time"?ku(o).test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{code:S.invalid_string,validation:"time",message:o.message}),r.dirty()):o.kind==="duration"?pu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"duration",code:S.invalid_string,message:o.message}),r.dirty()):o.kind==="ip"?Tu(e.data,o.version)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"ip",code:S.invalid_string,message:o.message}),r.dirty()):o.kind==="jwt"?Su(e.data,o.alg)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"jwt",code:S.invalid_string,message:o.message}),r.dirty()):o.kind==="cidr"?Eu(e.data,o.version)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"cidr",code:S.invalid_string,message:o.message}),r.dirty()):o.kind==="base64"?bu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"base64",code:S.invalid_string,message:o.message}),r.dirty()):o.kind==="base64url"?wu.test(e.data)||(i=this._getOrReturnCtx(e,i),M(i,{validation:"base64url",code:S.invalid_string,message:o.message}),r.dirty()):ne.assertNever(o);return{status:r.value,value:e.data}}_regex(e,n,r){return this.refinement(i=>e.test(i),{validation:n,code:S.invalid_string,...P.errToObj(r)})}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}email(e){return this._addCheck({kind:"email",...P.errToObj(e)})}url(e){return this._addCheck({kind:"url",...P.errToObj(e)})}emoji(e){return this._addCheck({kind:"emoji",...P.errToObj(e)})}uuid(e){return this._addCheck({kind:"uuid",...P.errToObj(e)})}nanoid(e){return this._addCheck({kind:"nanoid",...P.errToObj(e)})}cuid(e){return this._addCheck({kind:"cuid",...P.errToObj(e)})}cuid2(e){return this._addCheck({kind:"cuid2",...P.errToObj(e)})}ulid(e){return this._addCheck({kind:"ulid",...P.errToObj(e)})}base64(e){return this._addCheck({kind:"base64",...P.errToObj(e)})}base64url(e){return this._addCheck({kind:"base64url",...P.errToObj(e)})}jwt(e){return this._addCheck({kind:"jwt",...P.errToObj(e)})}ip(e){return this._addCheck({kind:"ip",...P.errToObj(e)})}cidr(e){return this._addCheck({kind:"cidr",...P.errToObj(e)})}datetime(e){return typeof e=="string"?this._addCheck({kind:"datetime",precision:null,offset:!1,local:!1,message:e}):this._addCheck({kind:"datetime",precision:typeof e?.precision>"u"?null:e?.precision,offset:e?.offset??!1,local:e?.local??!1,...P.errToObj(e?.message)})}date(e){return this._addCheck({kind:"date",message:e})}time(e){return typeof e=="string"?this._addCheck({kind:"time",precision:null,message:e}):this._addCheck({kind:"time",precision:typeof e?.precision>"u"?null:e?.precision,...P.errToObj(e?.message)})}duration(e){return this._addCheck({kind:"duration",...P.errToObj(e)})}regex(e,n){return this._addCheck({kind:"regex",regex:e,...P.errToObj(n)})}includes(e,n){return this._addCheck({kind:"includes",value:e,position:n?.position,...P.errToObj(n?.message)})}startsWith(e,n){return this._addCheck({kind:"startsWith",value:e,...P.errToObj(n)})}endsWith(e,n){return this._addCheck({kind:"endsWith",value:e,...P.errToObj(n)})}min(e,n){return this._addCheck({kind:"min",value:e,...P.errToObj(n)})}max(e,n){return this._addCheck({kind:"max",value:e,...P.errToObj(n)})}length(e,n){return this._addCheck({kind:"length",value:e,...P.errToObj(n)})}nonempty(e){return this.min(1,P.errToObj(e))}trim(){return new t({...this._def,checks:[...this._def.checks,{kind:"trim"}]})}toLowerCase(){return new t({...this._def,checks:[...this._def.checks,{kind:"toLowerCase"}]})}toUpperCase(){return new t({...this._def,checks:[...this._def.checks,{kind:"toUpperCase"}]})}get isDatetime(){return!!this._def.checks.find(e=>e.kind==="datetime")}get isDate(){return!!this._def.checks.find(e=>e.kind==="date")}get isTime(){return!!this._def.checks.find(e=>e.kind==="time")}get isDuration(){return!!this._def.checks.find(e=>e.kind==="duration")}get isEmail(){return!!this._def.checks.find(e=>e.kind==="email")}get isURL(){return!!this._def.checks.find(e=>e.kind==="url")}get isEmoji(){return!!this._def.checks.find(e=>e.kind==="emoji")}get isUUID(){return!!this._def.checks.find(e=>e.kind==="uuid")}get isNANOID(){return!!this._def.checks.find(e=>e.kind==="nanoid")}get isCUID(){return!!this._def.checks.find(e=>e.kind==="cuid")}get isCUID2(){return!!this._def.checks.find(e=>e.kind==="cuid2")}get isULID(){return!!this._def.checks.find(e=>e.kind==="ulid")}get isIP(){return!!this._def.checks.find(e=>e.kind==="ip")}get isCIDR(){return!!this._def.checks.find(e=>e.kind==="cidr")}get isBase64(){return!!this._def.checks.find(e=>e.kind==="base64")}get isBase64url(){return!!this._def.checks.find(e=>e.kind==="base64url")}get minLength(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxLength(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}};xn.create=t=>new xn({checks:[],typeName:H.ZodString,coerce:t?.coerce??!1,...W(t)});function _u(t,e){let n=(t.toString().split(".")[1]||"").length,r=(e.toString().split(".")[1]||"").length,i=n>r?n:r,o=Number.parseInt(t.toFixed(i).replace(".","")),s=Number.parseInt(e.toFixed(i).replace(".",""));return o%s/10**i}var zn=class t extends K{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte,this.step=this.multipleOf}_parse(e){if(this._def.coerce&&(e.data=Number(e.data)),this._getType(e)!==I.number){let o=this._getOrReturnCtx(e);return M(o,{code:S.invalid_type,expected:I.number,received:o.parsedType}),z}let r,i=new Ve;for(let o of this._def.checks)o.kind==="int"?ne.isInteger(e.data)||(r=this._getOrReturnCtx(e,r),M(r,{code:S.invalid_type,expected:"integer",received:"float",message:o.message}),i.dirty()):o.kind==="min"?(o.inclusive?e.data<o.value:e.data<=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.too_small,minimum:o.value,type:"number",inclusive:o.inclusive,exact:!1,message:o.message}),i.dirty()):o.kind==="max"?(o.inclusive?e.data>o.value:e.data>=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.too_big,maximum:o.value,type:"number",inclusive:o.inclusive,exact:!1,message:o.message}),i.dirty()):o.kind==="multipleOf"?_u(e.data,o.value)!==0&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.not_multiple_of,multipleOf:o.value,message:o.message}),i.dirty()):o.kind==="finite"?Number.isFinite(e.data)||(r=this._getOrReturnCtx(e,r),M(r,{code:S.not_finite,message:o.message}),i.dirty()):ne.assertNever(o);return{status:i.value,value:e.data}}gte(e,n){return this.setLimit("min",e,!0,P.toString(n))}gt(e,n){return this.setLimit("min",e,!1,P.toString(n))}lte(e,n){return this.setLimit("max",e,!0,P.toString(n))}lt(e,n){return this.setLimit("max",e,!1,P.toString(n))}setLimit(e,n,r,i){return new t({...this._def,checks:[...this._def.checks,{kind:e,value:n,inclusive:r,message:P.toString(i)}]})}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}int(e){return this._addCheck({kind:"int",message:P.toString(e)})}positive(e){return this._addCheck({kind:"min",value:0,inclusive:!1,message:P.toString(e)})}negative(e){return this._addCheck({kind:"max",value:0,inclusive:!1,message:P.toString(e)})}nonpositive(e){return this._addCheck({kind:"max",value:0,inclusive:!0,message:P.toString(e)})}nonnegative(e){return this._addCheck({kind:"min",value:0,inclusive:!0,message:P.toString(e)})}multipleOf(e,n){return this._addCheck({kind:"multipleOf",value:e,message:P.toString(n)})}finite(e){return this._addCheck({kind:"finite",message:P.toString(e)})}safe(e){return this._addCheck({kind:"min",inclusive:!0,value:Number.MIN_SAFE_INTEGER,message:P.toString(e)})._addCheck({kind:"max",inclusive:!0,value:Number.MAX_SAFE_INTEGER,message:P.toString(e)})}get minValue(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxValue(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}get isInt(){return!!this._def.checks.find(e=>e.kind==="int"||e.kind==="multipleOf"&&ne.isInteger(e.value))}get isFinite(){let e=null,n=null;for(let r of this._def.checks){if(r.kind==="finite"||r.kind==="int"||r.kind==="multipleOf")return!0;r.kind==="min"?(n===null||r.value>n)&&(n=r.value):r.kind==="max"&&(e===null||r.value<e)&&(e=r.value)}return Number.isFinite(n)&&Number.isFinite(e)}};zn.create=t=>new zn({checks:[],typeName:H.ZodNumber,coerce:t?.coerce||!1,...W(t)});var Hn=class t extends K{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte}_parse(e){if(this._def.coerce)try{e.data=BigInt(e.data)}catch{return this._getInvalidInput(e)}if(this._getType(e)!==I.bigint)return this._getInvalidInput(e);let r,i=new Ve;for(let o of this._def.checks)o.kind==="min"?(o.inclusive?e.data<o.value:e.data<=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.too_small,type:"bigint",minimum:o.value,inclusive:o.inclusive,message:o.message}),i.dirty()):o.kind==="max"?(o.inclusive?e.data>o.value:e.data>=o.value)&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.too_big,type:"bigint",maximum:o.value,inclusive:o.inclusive,message:o.message}),i.dirty()):o.kind==="multipleOf"?e.data%o.value!==BigInt(0)&&(r=this._getOrReturnCtx(e,r),M(r,{code:S.not_multiple_of,multipleOf:o.value,message:o.message}),i.dirty()):ne.assertNever(o);return{status:i.value,value:e.data}}_getInvalidInput(e){let n=this._getOrReturnCtx(e);return M(n,{code:S.invalid_type,expected:I.bigint,received:n.parsedType}),z}gte(e,n){return this.setLimit("min",e,!0,P.toString(n))}gt(e,n){return this.setLimit("min",e,!1,P.toString(n))}lte(e,n){return this.setLimit("max",e,!0,P.toString(n))}lt(e,n){return this.setLimit("max",e,!1,P.toString(n))}setLimit(e,n,r,i){return new t({...this._def,checks:[...this._def.checks,{kind:e,value:n,inclusive:r,message:P.toString(i)}]})}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}positive(e){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!1,message:P.toString(e)})}negative(e){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!1,message:P.toString(e)})}nonpositive(e){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!0,message:P.toString(e)})}nonnegative(e){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!0,message:P.toString(e)})}multipleOf(e,n){return this._addCheck({kind:"multipleOf",value:e,message:P.toString(n)})}get minValue(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e}get maxValue(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e}};Hn.create=t=>new Hn({checks:[],typeName:H.ZodBigInt,coerce:t?.coerce??!1,...W(t)});var $n=class extends K{_parse(e){if(this._def.coerce&&(e.data=!!e.data),this._getType(e)!==I.boolean){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:I.boolean,received:r.parsedType}),z}return Ze(e.data)}};$n.create=t=>new $n({typeName:H.ZodBoolean,coerce:t?.coerce||!1,...W(t)});var Fn=class t extends K{_parse(e){if(this._def.coerce&&(e.data=new Date(e.data)),this._getType(e)!==I.date){let o=this._getOrReturnCtx(e);return M(o,{code:S.invalid_type,expected:I.date,received:o.parsedType}),z}if(Number.isNaN(e.data.getTime())){let o=this._getOrReturnCtx(e);return M(o,{code:S.invalid_date}),z}let r=new Ve,i;for(let o of this._def.checks)o.kind==="min"?e.data.getTime()<o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:S.too_small,message:o.message,inclusive:!0,exact:!1,minimum:o.value,type:"date"}),r.dirty()):o.kind==="max"?e.data.getTime()>o.value&&(i=this._getOrReturnCtx(e,i),M(i,{code:S.too_big,message:o.message,inclusive:!0,exact:!1,maximum:o.value,type:"date"}),r.dirty()):ne.assertNever(o);return{status:r.value,value:new Date(e.data.getTime())}}_addCheck(e){return new t({...this._def,checks:[...this._def.checks,e]})}min(e,n){return this._addCheck({kind:"min",value:e.getTime(),message:P.toString(n)})}max(e,n){return this._addCheck({kind:"max",value:e.getTime(),message:P.toString(n)})}get minDate(){let e=null;for(let n of this._def.checks)n.kind==="min"&&(e===null||n.value>e)&&(e=n.value);return e!=null?new Date(e):null}get maxDate(){let e=null;for(let n of this._def.checks)n.kind==="max"&&(e===null||n.value<e)&&(e=n.value);return e!=null?new Date(e):null}};Fn.create=t=>new Fn({checks:[],coerce:t?.coerce||!1,typeName:H.ZodDate,...W(t)});var xr=class extends K{_parse(e){if(this._getType(e)!==I.symbol){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:I.symbol,received:r.parsedType}),z}return Ze(e.data)}};xr.create=t=>new xr({typeName:H.ZodSymbol,...W(t)});var jn=class extends K{_parse(e){if(this._getType(e)!==I.undefined){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:I.undefined,received:r.parsedType}),z}return Ze(e.data)}};jn.create=t=>new jn({typeName:H.ZodUndefined,...W(t)});var Vn=class extends K{_parse(e){if(this._getType(e)!==I.null){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:I.null,received:r.parsedType}),z}return Ze(e.data)}};Vn.create=t=>new Vn({typeName:H.ZodNull,...W(t)});var kn=class extends K{constructor(){super(...arguments),this._any=!0}_parse(e){return Ze(e.data)}};kn.create=t=>new kn({typeName:H.ZodAny,...W(t)});var rn=class extends K{constructor(){super(...arguments),this._unknown=!0}_parse(e){return Ze(e.data)}};rn.create=t=>new rn({typeName:H.ZodUnknown,...W(t)});var Dt=class extends K{_parse(e){let n=this._getOrReturnCtx(e);return M(n,{code:S.invalid_type,expected:I.never,received:n.parsedType}),z}};Dt.create=t=>new Dt({typeName:H.ZodNever,...W(t)});var kr=class extends K{_parse(e){if(this._getType(e)!==I.undefined){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:I.void,received:r.parsedType}),z}return Ze(e.data)}};kr.create=t=>new kr({typeName:H.ZodVoid,...W(t)});var on=class t extends K{_parse(e){let{ctx:n,status:r}=this._processInputParams(e),i=this._def;if(n.parsedType!==I.array)return M(n,{code:S.invalid_type,expected:I.array,received:n.parsedType}),z;if(i.exactLength!==null){let s=n.data.length>i.exactLength.value,a=n.data.length<i.exactLength.value;(s||a)&&(M(n,{code:s?S.too_big:S.too_small,minimum:a?i.exactLength.value:void 0,maximum:s?i.exactLength.value:void 0,type:"array",inclusive:!0,exact:!0,message:i.exactLength.message}),r.dirty())}if(i.minLength!==null&&n.data.length<i.minLength.value&&(M(n,{code:S.too_small,minimum:i.minLength.value,type:"array",inclusive:!0,exact:!1,message:i.minLength.message}),r.dirty()),i.maxLength!==null&&n.data.length>i.maxLength.value&&(M(n,{code:S.too_big,maximum:i.maxLength.value,type:"array",inclusive:!0,exact:!1,message:i.maxLength.message}),r.dirty()),n.common.async)return Promise.all([...n.data].map((s,a)=>i.type._parseAsync(new wt(n,s,n.path,a)))).then(s=>Ve.mergeArray(r,s));let o=[...n.data].map((s,a)=>i.type._parseSync(new wt(n,s,n.path,a)));return Ve.mergeArray(r,o)}get element(){return this._def.type}min(e,n){return new t({...this._def,minLength:{value:e,message:P.toString(n)}})}max(e,n){return new t({...this._def,maxLength:{value:e,message:P.toString(n)}})}length(e,n){return new t({...this._def,exactLength:{value:e,message:P.toString(n)}})}nonempty(e){return this.min(1,e)}};on.create=(t,e)=>new on({type:t,minLength:null,maxLength:null,exactLength:null,typeName:H.ZodArray,...W(e)});function wr(t){if(t instanceof lt){let e={};for(let n in t.shape){let r=t.shape[n];e[n]=bt.create(wr(r))}return new lt({...t._def,shape:()=>e})}else return t instanceof on?new on({...t._def,type:wr(t.element)}):t instanceof bt?bt.create(wr(t.unwrap())):t instanceof jt?jt.create(wr(t.unwrap())):t instanceof Ft?Ft.create(t.items.map(e=>wr(e))):t}var lt=class t extends K{constructor(){super(...arguments),this._cached=null,this.nonstrict=this.passthrough,this.augment=this.extend}_getCached(){if(this._cached!==null)return this._cached;let e=this._def.shape(),n=ne.objectKeys(e);return this._cached={shape:e,keys:n},this._cached}_parse(e){if(this._getType(e)!==I.object){let c=this._getOrReturnCtx(e);return M(c,{code:S.invalid_type,expected:I.object,received:c.parsedType}),z}let{status:r,ctx:i}=this._processInputParams(e),{shape:o,keys:s}=this._getCached(),a=[];if(!(this._def.catchall instanceof Dt&&this._def.unknownKeys==="strip"))for(let c in i.data)s.includes(c)||a.push(c);let p=[];for(let c of s){let u=o[c],g=i.data[c];p.push({key:{status:"valid",value:c},value:u._parse(new wt(i,g,i.path,c)),alwaysSet:c in i.data})}if(this._def.catchall instanceof Dt){let c=this._def.unknownKeys;if(c==="passthrough")for(let u of a)p.push({key:{status:"valid",value:u},value:{status:"valid",value:i.data[u]}});else if(c==="strict")a.length>0&&(M(i,{code:S.unrecognized_keys,keys:a}),r.dirty());else if(c!=="strip")throw new Error("Internal ZodObject error: invalid unknownKeys value.")}else{let c=this._def.catchall;for(let u of a){let g=i.data[u];p.push({key:{status:"valid",value:u},value:c._parse(new wt(i,g,i.path,u)),alwaysSet:u in i.data})}}return i.common.async?Promise.resolve().then(async()=>{let c=[];for(let u of p){let g=await u.key,y=await u.value;c.push({key:g,value:y,alwaysSet:u.alwaysSet})}return c}).then(c=>Ve.mergeObjectSync(r,c)):Ve.mergeObjectSync(r,p)}get shape(){return this._def.shape()}strict(e){return P.errToObj,new t({...this._def,unknownKeys:"strict",...e!==void 0?{errorMap:(n,r)=>{let i=this._def.errorMap?.(n,r).message??r.defaultError;return n.code==="unrecognized_keys"?{message:P.errToObj(e).message??i}:{message:i}}}:{}})}strip(){return new t({...this._def,unknownKeys:"strip"})}passthrough(){return new t({...this._def,unknownKeys:"passthrough"})}extend(e){return new t({...this._def,shape:()=>({...this._def.shape(),...e})})}merge(e){return new t({unknownKeys:e._def.unknownKeys,catchall:e._def.catchall,shape:()=>({...this._def.shape(),...e._def.shape()}),typeName:H.ZodObject})}setKey(e,n){return this.augment({[e]:n})}catchall(e){return new t({...this._def,catchall:e})}pick(e){let n={};for(let r of ne.objectKeys(e))e[r]&&this.shape[r]&&(n[r]=this.shape[r]);return new t({...this._def,shape:()=>n})}omit(e){let n={};for(let r of ne.objectKeys(this.shape))e[r]||(n[r]=this.shape[r]);return new t({...this._def,shape:()=>n})}deepPartial(){return wr(this)}partial(e){let n={};for(let r of ne.objectKeys(this.shape)){let i=this.shape[r];e&&!e[r]?n[r]=i:n[r]=i.optional()}return new t({...this._def,shape:()=>n})}required(e){let n={};for(let r of ne.objectKeys(this.shape))if(e&&!e[r])n[r]=this.shape[r];else{let o=this.shape[r];for(;o instanceof bt;)o=o._def.innerType;n[r]=o}return new t({...this._def,shape:()=>n})}keyof(){return is(ne.objectKeys(this.shape))}};lt.create=(t,e)=>new lt({shape:()=>t,unknownKeys:"strip",catchall:Dt.create(),typeName:H.ZodObject,...W(e)});lt.strictCreate=(t,e)=>new lt({shape:()=>t,unknownKeys:"strict",catchall:Dt.create(),typeName:H.ZodObject,...W(e)});lt.lazycreate=(t,e)=>new lt({shape:t,unknownKeys:"strip",catchall:Dt.create(),typeName:H.ZodObject,...W(e)});var Un=class extends K{_parse(e){let{ctx:n}=this._processInputParams(e),r=this._def.options;function i(o){for(let a of o)if(a.result.status==="valid")return a.result;for(let a of o)if(a.result.status==="dirty")return n.common.issues.push(...a.ctx.common.issues),a.result;let s=o.map(a=>new st(a.ctx.common.issues));return M(n,{code:S.invalid_union,unionErrors:s}),z}if(n.common.async)return Promise.all(r.map(async o=>{let s={...n,common:{...n.common,issues:[]},parent:null};return{result:await o._parseAsync({data:n.data,path:n.path,parent:s}),ctx:s}})).then(i);{let o,s=[];for(let p of r){let c={...n,common:{...n.common,issues:[]},parent:null},u=p._parseSync({data:n.data,path:n.path,parent:c});if(u.status==="valid")return u;u.status==="dirty"&&!o&&(o={result:u,ctx:c}),c.common.issues.length&&s.push(c.common.issues)}if(o)return n.common.issues.push(...o.ctx.common.issues),o.result;let a=s.map(p=>new st(p));return M(n,{code:S.invalid_union,unionErrors:a}),z}}get options(){return this._def.options}};Un.create=(t,e)=>new Un({options:t,typeName:H.ZodUnion,...W(e)});var nn=t=>t instanceof qn?nn(t.schema):t instanceof xt?nn(t.innerType()):t instanceof Zn?[t.value]:t instanceof Wn?t.options:t instanceof Yn?ne.objectValues(t.enum):t instanceof Kn?nn(t._def.innerType):t instanceof jn?[void 0]:t instanceof Vn?[null]:t instanceof bt?[void 0,...nn(t.unwrap())]:t instanceof jt?[null,...nn(t.unwrap())]:t instanceof Kr||t instanceof Xn?nn(t.unwrap()):t instanceof Jn?nn(t._def.innerType):[],qo=class t extends K{_parse(e){let{ctx:n}=this._processInputParams(e);if(n.parsedType!==I.object)return M(n,{code:S.invalid_type,expected:I.object,received:n.parsedType}),z;let r=this.discriminator,i=n.data[r],o=this.optionsMap.get(i);return o?n.common.async?o._parseAsync({data:n.data,path:n.path,parent:n}):o._parseSync({data:n.data,path:n.path,parent:n}):(M(n,{code:S.invalid_union_discriminator,options:Array.from(this.optionsMap.keys()),path:[r]}),z)}get discriminator(){return this._def.discriminator}get options(){return this._def.options}get optionsMap(){return this._def.optionsMap}static create(e,n,r){let i=new Map;for(let o of n){let s=nn(o.shape[e]);if(!s.length)throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);for(let a of s){if(i.has(a))throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(a)}`);i.set(a,o)}}return new t({typeName:H.ZodDiscriminatedUnion,discriminator:e,options:n,optionsMap:i,...W(r)})}};function Li(t,e){let n=$t(t),r=$t(e);if(t===e)return{valid:!0,data:t};if(n===I.object&&r===I.object){let i=ne.objectKeys(e),o=ne.objectKeys(t).filter(a=>i.indexOf(a)!==-1),s={...t,...e};for(let a of o){let p=Li(t[a],e[a]);if(!p.valid)return{valid:!1};s[a]=p.data}return{valid:!0,data:s}}else if(n===I.array&&r===I.array){if(t.length!==e.length)return{valid:!1};let i=[];for(let o=0;o<t.length;o++){let s=t[o],a=e[o],p=Li(s,a);if(!p.valid)return{valid:!1};i.push(p.data)}return{valid:!0,data:i}}else return n===I.date&&r===I.date&&+t==+e?{valid:!0,data:t}:{valid:!1}}var Gn=class extends K{_parse(e){let{status:n,ctx:r}=this._processInputParams(e),i=(o,s)=>{if(Uo(o)||Uo(s))return z;let a=Li(o.value,s.value);return a.valid?((Go(o)||Go(s))&&n.dirty(),{status:n.value,value:a.data}):(M(r,{code:S.invalid_intersection_types}),z)};return r.common.async?Promise.all([this._def.left._parseAsync({data:r.data,path:r.path,parent:r}),this._def.right._parseAsync({data:r.data,path:r.path,parent:r})]).then(([o,s])=>i(o,s)):i(this._def.left._parseSync({data:r.data,path:r.path,parent:r}),this._def.right._parseSync({data:r.data,path:r.path,parent:r}))}};Gn.create=(t,e,n)=>new Gn({left:t,right:e,typeName:H.ZodIntersection,...W(n)});var Ft=class t extends K{_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==I.array)return M(r,{code:S.invalid_type,expected:I.array,received:r.parsedType}),z;if(r.data.length<this._def.items.length)return M(r,{code:S.too_small,minimum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),z;!this._def.rest&&r.data.length>this._def.items.length&&(M(r,{code:S.too_big,maximum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),n.dirty());let o=[...r.data].map((s,a)=>{let p=this._def.items[a]||this._def.rest;return p?p._parse(new wt(r,s,r.path,a)):null}).filter(s=>!!s);return r.common.async?Promise.all(o).then(s=>Ve.mergeArray(n,s)):Ve.mergeArray(n,o)}get items(){return this._def.items}rest(e){return new t({...this._def,rest:e})}};Ft.create=(t,e)=>{if(!Array.isArray(t))throw new Error("You must pass an array of schemas to z.tuple([ ... ])");return new Ft({items:t,typeName:H.ZodTuple,rest:null,...W(e)})};var Zo=class t extends K{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==I.object)return M(r,{code:S.invalid_type,expected:I.object,received:r.parsedType}),z;let i=[],o=this._def.keyType,s=this._def.valueType;for(let a in r.data)i.push({key:o._parse(new wt(r,a,r.path,a)),value:s._parse(new wt(r,r.data[a],r.path,a)),alwaysSet:a in r.data});return r.common.async?Ve.mergeObjectAsync(n,i):Ve.mergeObjectSync(n,i)}get element(){return this._def.valueType}static create(e,n,r){return n instanceof K?new t({keyType:e,valueType:n,typeName:H.ZodRecord,...W(r)}):new t({keyType:xn.create(),valueType:e,typeName:H.ZodRecord,...W(n)})}},Tr=class extends K{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==I.map)return M(r,{code:S.invalid_type,expected:I.map,received:r.parsedType}),z;let i=this._def.keyType,o=this._def.valueType,s=[...r.data.entries()].map(([a,p],c)=>({key:i._parse(new wt(r,a,r.path,[c,"key"])),value:o._parse(new wt(r,p,r.path,[c,"value"]))}));if(r.common.async){let a=new Map;return Promise.resolve().then(async()=>{for(let p of s){let c=await p.key,u=await p.value;if(c.status==="aborted"||u.status==="aborted")return z;(c.status==="dirty"||u.status==="dirty")&&n.dirty(),a.set(c.value,u.value)}return{status:n.value,value:a}})}else{let a=new Map;for(let p of s){let c=p.key,u=p.value;if(c.status==="aborted"||u.status==="aborted")return z;(c.status==="dirty"||u.status==="dirty")&&n.dirty(),a.set(c.value,u.value)}return{status:n.value,value:a}}}};Tr.create=(t,e,n)=>new Tr({valueType:e,keyType:t,typeName:H.ZodMap,...W(n)});var Sr=class t extends K{_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.parsedType!==I.set)return M(r,{code:S.invalid_type,expected:I.set,received:r.parsedType}),z;let i=this._def;i.minSize!==null&&r.data.size<i.minSize.value&&(M(r,{code:S.too_small,minimum:i.minSize.value,type:"set",inclusive:!0,exact:!1,message:i.minSize.message}),n.dirty()),i.maxSize!==null&&r.data.size>i.maxSize.value&&(M(r,{code:S.too_big,maximum:i.maxSize.value,type:"set",inclusive:!0,exact:!1,message:i.maxSize.message}),n.dirty());let o=this._def.valueType;function s(p){let c=new Set;for(let u of p){if(u.status==="aborted")return z;u.status==="dirty"&&n.dirty(),c.add(u.value)}return{status:n.value,value:c}}let a=[...r.data.values()].map((p,c)=>o._parse(new wt(r,p,r.path,c)));return r.common.async?Promise.all(a).then(p=>s(p)):s(a)}min(e,n){return new t({...this._def,minSize:{value:e,message:P.toString(n)}})}max(e,n){return new t({...this._def,maxSize:{value:e,message:P.toString(n)}})}size(e,n){return this.min(e,n).max(e,n)}nonempty(e){return this.min(1,e)}};Sr.create=(t,e)=>new Sr({valueType:t,minSize:null,maxSize:null,typeName:H.ZodSet,...W(e)});var Wo=class t extends K{constructor(){super(...arguments),this.validate=this.implement}_parse(e){let{ctx:n}=this._processInputParams(e);if(n.parsedType!==I.function)return M(n,{code:S.invalid_type,expected:I.function,received:n.parsedType}),z;function r(a,p){return Yr({data:a,path:n.path,errorMaps:[n.common.contextualErrorMap,n.schemaErrorMap,yr(),tn].filter(c=>!!c),issueData:{code:S.invalid_arguments,argumentsError:p}})}function i(a,p){return Yr({data:a,path:n.path,errorMaps:[n.common.contextualErrorMap,n.schemaErrorMap,yr(),tn].filter(c=>!!c),issueData:{code:S.invalid_return_type,returnTypeError:p}})}let o={errorMap:n.common.contextualErrorMap},s=n.data;if(this._def.returns instanceof Tn){let a=this;return Ze(async function(...p){let c=new st([]),u=await a._def.args.parseAsync(p,o).catch(A=>{throw c.addIssue(r(p,A)),c}),g=await Reflect.apply(s,this,u);return await a._def.returns._def.type.parseAsync(g,o).catch(A=>{throw c.addIssue(i(g,A)),c})})}else{let a=this;return Ze(function(...p){let c=a._def.args.safeParse(p,o);if(!c.success)throw new st([r(p,c.error)]);let u=Reflect.apply(s,this,c.data),g=a._def.returns.safeParse(u,o);if(!g.success)throw new st([i(u,g.error)]);return g.data})}}parameters(){return this._def.args}returnType(){return this._def.returns}args(...e){return new t({...this._def,args:Ft.create(e).rest(rn.create())})}returns(e){return new t({...this._def,returns:e})}implement(e){return this.parse(e)}strictImplement(e){return this.parse(e)}static create(e,n,r){return new t({args:e||Ft.create([]).rest(rn.create()),returns:n||rn.create(),typeName:H.ZodFunction,...W(r)})}},qn=class extends K{get schema(){return this._def.getter()}_parse(e){let{ctx:n}=this._processInputParams(e);return this._def.getter()._parse({data:n.data,path:n.path,parent:n})}};qn.create=(t,e)=>new qn({getter:t,typeName:H.ZodLazy,...W(e)});var Zn=class extends K{_parse(e){if(e.data!==this._def.value){let n=this._getOrReturnCtx(e);return M(n,{received:n.data,code:S.invalid_literal,expected:this._def.value}),z}return{status:"valid",value:e.data}}get value(){return this._def.value}};Zn.create=(t,e)=>new Zn({value:t,typeName:H.ZodLiteral,...W(e)});function is(t,e){return new Wn({values:t,typeName:H.ZodEnum,...W(e)})}var Wn=class t extends K{_parse(e){if(typeof e.data!="string"){let n=this._getOrReturnCtx(e),r=this._def.values;return M(n,{expected:ne.joinValues(r),received:n.parsedType,code:S.invalid_type}),z}if(this._cache||(this._cache=new Set(this._def.values)),!this._cache.has(e.data)){let n=this._getOrReturnCtx(e),r=this._def.values;return M(n,{received:n.data,code:S.invalid_enum_value,options:r}),z}return Ze(e.data)}get options(){return this._def.values}get enum(){let e={};for(let n of this._def.values)e[n]=n;return e}get Values(){let e={};for(let n of this._def.values)e[n]=n;return e}get Enum(){let e={};for(let n of this._def.values)e[n]=n;return e}extract(e,n=this._def){return t.create(e,{...this._def,...n})}exclude(e,n=this._def){return t.create(this.options.filter(r=>!e.includes(r)),{...this._def,...n})}};Wn.create=is;var Yn=class extends K{_parse(e){let n=ne.getValidEnumValues(this._def.values),r=this._getOrReturnCtx(e);if(r.parsedType!==I.string&&r.parsedType!==I.number){let i=ne.objectValues(n);return M(r,{expected:ne.joinValues(i),received:r.parsedType,code:S.invalid_type}),z}if(this._cache||(this._cache=new Set(ne.getValidEnumValues(this._def.values))),!this._cache.has(e.data)){let i=ne.objectValues(n);return M(r,{received:r.data,code:S.invalid_enum_value,options:i}),z}return Ze(e.data)}get enum(){return this._def.values}};Yn.create=(t,e)=>new Yn({values:t,typeName:H.ZodNativeEnum,...W(e)});var Tn=class extends K{unwrap(){return this._def.type}_parse(e){let{ctx:n}=this._processInputParams(e);if(n.parsedType!==I.promise&&n.common.async===!1)return M(n,{code:S.invalid_type,expected:I.promise,received:n.parsedType}),z;let r=n.parsedType===I.promise?n.data:Promise.resolve(n.data);return Ze(r.then(i=>this._def.type.parseAsync(i,{path:n.path,errorMap:n.common.contextualErrorMap})))}};Tn.create=(t,e)=>new Tn({type:t,typeName:H.ZodPromise,...W(e)});var xt=class extends K{innerType(){return this._def.schema}sourceType(){return this._def.schema._def.typeName===H.ZodEffects?this._def.schema.sourceType():this._def.schema}_parse(e){let{status:n,ctx:r}=this._processInputParams(e),i=this._def.effect||null,o={addIssue:s=>{M(r,s),s.fatal?n.abort():n.dirty()},get path(){return r.path}};if(o.addIssue=o.addIssue.bind(o),i.type==="preprocess"){let s=i.transform(r.data,o);if(r.common.async)return Promise.resolve(s).then(async a=>{if(n.value==="aborted")return z;let p=await this._def.schema._parseAsync({data:a,path:r.path,parent:r});return p.status==="aborted"?z:p.status==="dirty"?Nn(p.value):n.value==="dirty"?Nn(p.value):p});{if(n.value==="aborted")return z;let a=this._def.schema._parseSync({data:s,path:r.path,parent:r});return a.status==="aborted"?z:a.status==="dirty"?Nn(a.value):n.value==="dirty"?Nn(a.value):a}}if(i.type==="refinement"){let s=a=>{let p=i.refinement(a,o);if(r.common.async)return Promise.resolve(p);if(p instanceof Promise)throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");return a};if(r.common.async===!1){let a=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});return a.status==="aborted"?z:(a.status==="dirty"&&n.dirty(),s(a.value),{status:n.value,value:a.value})}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(a=>a.status==="aborted"?z:(a.status==="dirty"&&n.dirty(),s(a.value).then(()=>({status:n.value,value:a.value}))))}if(i.type==="transform")if(r.common.async===!1){let s=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});if(!wn(s))return z;let a=i.transform(s.value,o);if(a instanceof Promise)throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");return{status:n.value,value:a}}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(s=>wn(s)?Promise.resolve(i.transform(s.value,o)).then(a=>({status:n.value,value:a})):z);ne.assertNever(i)}};xt.create=(t,e,n)=>new xt({schema:t,typeName:H.ZodEffects,effect:e,...W(n)});xt.createWithPreprocess=(t,e,n)=>new xt({schema:e,effect:{type:"preprocess",transform:t},typeName:H.ZodEffects,...W(n)});var bt=class extends K{_parse(e){return this._getType(e)===I.undefined?Ze(void 0):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}};bt.create=(t,e)=>new bt({innerType:t,typeName:H.ZodOptional,...W(e)});var jt=class extends K{_parse(e){return this._getType(e)===I.null?Ze(null):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}};jt.create=(t,e)=>new jt({innerType:t,typeName:H.ZodNullable,...W(e)});var Kn=class extends K{_parse(e){let{ctx:n}=this._processInputParams(e),r=n.data;return n.parsedType===I.undefined&&(r=this._def.defaultValue()),this._def.innerType._parse({data:r,path:n.path,parent:n})}removeDefault(){return this._def.innerType}};Kn.create=(t,e)=>new Kn({innerType:t,typeName:H.ZodDefault,defaultValue:typeof e.default=="function"?e.default:()=>e.default,...W(e)});var Jn=class extends K{_parse(e){let{ctx:n}=this._processInputParams(e),r={...n,common:{...n.common,issues:[]}},i=this._def.innerType._parse({data:r.data,path:r.path,parent:{...r}});return br(i)?i.then(o=>({status:"valid",value:o.status==="valid"?o.value:this._def.catchValue({get error(){return new st(r.common.issues)},input:r.data})})):{status:"valid",value:i.status==="valid"?i.value:this._def.catchValue({get error(){return new st(r.common.issues)},input:r.data})}}removeCatch(){return this._def.innerType}};Jn.create=(t,e)=>new Jn({innerType:t,typeName:H.ZodCatch,catchValue:typeof e.catch=="function"?e.catch:()=>e.catch,...W(e)});var Er=class extends K{_parse(e){if(this._getType(e)!==I.nan){let r=this._getOrReturnCtx(e);return M(r,{code:S.invalid_type,expected:I.nan,received:r.parsedType}),z}return{status:"valid",value:e.data}}};Er.create=t=>new Er({typeName:H.ZodNaN,...W(t)});var Au=Symbol("zod_brand"),Kr=class extends K{_parse(e){let{ctx:n}=this._processInputParams(e),r=n.data;return this._def.type._parse({data:r,path:n.path,parent:n})}unwrap(){return this._def.type}},Jr=class t extends K{_parse(e){let{status:n,ctx:r}=this._processInputParams(e);if(r.common.async)return(async()=>{let o=await this._def.in._parseAsync({data:r.data,path:r.path,parent:r});return o.status==="aborted"?z:o.status==="dirty"?(n.dirty(),Nn(o.value)):this._def.out._parseAsync({data:o.value,path:r.path,parent:r})})();{let i=this._def.in._parseSync({data:r.data,path:r.path,parent:r});return i.status==="aborted"?z:i.status==="dirty"?(n.dirty(),{status:"dirty",value:i.value}):this._def.out._parseSync({data:i.value,path:r.path,parent:r})}}static create(e,n){return new t({in:e,out:n,typeName:H.ZodPipeline})}},Xn=class extends K{_parse(e){let n=this._def.innerType._parse(e),r=i=>(wn(i)&&(i.value=Object.freeze(i.value)),i);return br(n)?n.then(i=>r(i)):r(n)}unwrap(){return this._def.innerType}};Xn.create=(t,e)=>new Xn({innerType:t,typeName:H.ZodReadonly,...W(e)});function ts(t,e){let n=typeof t=="function"?t(e):typeof t=="string"?{message:t}:t;return typeof n=="string"?{message:n}:n}function as(t,e={},n){return t?kn.create().superRefine((r,i)=>{let o=t(r);if(o instanceof Promise)return o.then(s=>{if(!s){let a=ts(e,r),p=a.fatal??n??!0;i.addIssue({code:"custom",...a,fatal:p})}});if(!o){let s=ts(e,r),a=s.fatal??n??!0;i.addIssue({code:"custom",...s,fatal:a})}}):kn.create()}var Mu={object:lt.lazycreate},H;(function(t){t.ZodString="ZodString",t.ZodNumber="ZodNumber",t.ZodNaN="ZodNaN",t.ZodBigInt="ZodBigInt",t.ZodBoolean="ZodBoolean",t.ZodDate="ZodDate",t.ZodSymbol="ZodSymbol",t.ZodUndefined="ZodUndefined",t.ZodNull="ZodNull",t.ZodAny="ZodAny",t.ZodUnknown="ZodUnknown",t.ZodNever="ZodNever",t.ZodVoid="ZodVoid",t.ZodArray="ZodArray",t.ZodObject="ZodObject",t.ZodUnion="ZodUnion",t.ZodDiscriminatedUnion="ZodDiscriminatedUnion",t.ZodIntersection="ZodIntersection",t.ZodTuple="ZodTuple",t.ZodRecord="ZodRecord",t.ZodMap="ZodMap",t.ZodSet="ZodSet",t.ZodFunction="ZodFunction",t.ZodLazy="ZodLazy",t.ZodLiteral="ZodLiteral",t.ZodEnum="ZodEnum",t.ZodEffects="ZodEffects",t.ZodNativeEnum="ZodNativeEnum",t.ZodOptional="ZodOptional",t.ZodNullable="ZodNullable",t.ZodDefault="ZodDefault",t.ZodCatch="ZodCatch",t.ZodPromise="ZodPromise",t.ZodBranded="ZodBranded",t.ZodPipeline="ZodPipeline",t.ZodReadonly="ZodReadonly"})(H||(H={}));var Lu=(t,e={message:`Input not instance of ${t.name}`})=>as(n=>n instanceof t,e),ss=xn.create,ls=zn.create,Iu=Er.create,Cu=Hn.create,cs=$n.create,Du=Fn.create,Bu=xr.create,Ru=jn.create,Pu=Vn.create,Ou=kn.create,Nu=rn.create,zu=Dt.create,Hu=kr.create,$u=on.create,Fu=lt.create,ju=lt.strictCreate,Vu=Un.create,Uu=qo.create,Gu=Gn.create,qu=Ft.create,Zu=Zo.create,Wu=Tr.create,Yu=Sr.create,Ku=Wo.create,Ju=qn.create,Xu=Zn.create,Qu=Wn.create,ed=Yn.create,td=Tn.create,nd=xt.create,rd=bt.create,od=jt.create,id=xt.createWithPreprocess,ad=Jr.create,sd=()=>ss().optional(),ld=()=>ls().optional(),cd=()=>cs().optional(),ud={string:(t=>xn.create({...t,coerce:!0})),number:(t=>zn.create({...t,coerce:!0})),boolean:(t=>$n.create({...t,coerce:!0})),bigint:(t=>Hn.create({...t,coerce:!0})),date:(t=>Fn.create({...t,coerce:!0}))};var dd=z;var us=`<svg
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
</svg>`;var ds=`<svg
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
</svg>`;var ps=`<svg
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
</svg>`;var ms=`<svg
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
</svg>`;var fs=`<svg
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
</svg>`;var hs=`<svg
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
</svg>`;var gs=`<svg
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
</svg>`;var vs=`<svg
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
</svg>`;var ys=`<svg
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
</svg>`;var bs=`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="icon icon-tabler icons-tabler-filled icon-tabler-current-location"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1a1 1 0 0 1 1 1v1.055a9.004 9.004 0 0 1 7.946 7.945h1.054a1 1 0 0 1 0 2h-1.055a9.004 9.004 0 0 1 -7.944 7.945l-.001 1.055a1 1 0 0 1 -2 0v-1.055a9.004 9.004 0 0 1 -7.945 -7.944l-1.055 -.001a1 1 0 0 1 0 -2h1.055a9.004 9.004 0 0 1 7.945 -7.945v-1.055a1 1 0 0 1 1 -1m0 4a7 7 0 1 0 0 14a7 7 0 0 0 0 -14m0 3a4 4 0 1 1 -4 4l.005 -.2a4 4 0 0 1 3.995 -3.8" />
</svg>`;var ws=`<svg
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
</svg>`;var xs=`<svg
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
</svg>`;var ks=`<svg
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
</svg>`;var Ts=`<svg
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
</svg>`;var Ss=`<svg
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
</svg>`;var Es=`<svg
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
</svg>`;var _s=`<svg
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
</svg>`;var As=`<svg
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
</svg>`;var Ms=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-file-spreadsheet"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
  <path d="M8 11h8v7h-8l0 -7" />
  <path d="M8 15h8" />
  <path d="M11 11v7" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-login"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M21 12h-13l3 -3" />
  <path d="M11 15l-3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-logout"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-refresh"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
</svg>`;var Bs=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-database"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" />
  <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
  <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-server"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3" />
  <path d="M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2" />
  <path d="M7 8l0 .01" />
  <path d="M7 16l0 .01" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-world"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  <path d="M3.6 9h16.8" />
  <path d="M3.6 15h16.8" />
  <path d="M11.5 3a17 17 0 0 0 0 18" />
  <path d="M12.5 3a17 17 0 0 1 0 18" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5" />
  <path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5" />
  <path d="M3 21l2.5 -2.5" />
  <path d="M18.5 5.5l2.5 -2.5" />
  <path d="M10 11l-2 2" />
  <path d="M13 14l-2 2" />
</svg>`;var zs=`<svg
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-x"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-11 0" />
  <path d="M20 12l-7 0" />
  <path d="M20 18l-11 0" />
  <path d="M4 8l4 4l-4 4" />
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
  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-decrease"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 6l-7 0" />
  <path d="M20 12l-9 0" />
  <path d="M20 18l-7 0" />
  <path d="M8 8l-4 4l4 4" />
</svg>`;var Ud={plus:us,"alarm-plus":ds,minus:ps,"circle-plus":ms,"circle-minus":fs,trash:hs,clipboard:gs,settings:vs,"clock-plus":ys,"current-location":bs,"player-record":ws,"circle-x":xs,"circle-check":ks,"adjustments-horizontal":Ts,cloud:Ss,"device-floppy":Es,"folder-open":_s,"file-export":As,"file-import":Ms,"file-spreadsheet":Ls,login:Is,logout:Cs,refresh:Ds,"alert-triangle":Bs,database:Rs,server:Ps,world:Os,"plug-connected":Ns,key:zs,x:Hs,"indent-increase":$s,"indent-decrease":Fs},js="http://www.w3.org/2000/svg",Gd=/^\s*<svg\s+([^>]*)>([\s\S]*?)<\/svg>\s*$/,qd=/<([a-zA-Z][\w:-]*)([^>]*)\/>/g,Zd=/([a-zA-Z_:][\w:.-]*)="([^"]*)"/g,Vs=new Map;function Us(t){let e={};for(let n of t.matchAll(Zd))e[n[1]]=n[2];return e}function Wd(t){return t.startsWith("data:image/svg+xml;base64,")?atob(t.slice(26)):t.startsWith("data:image/svg+xml,")?decodeURIComponent(t.slice(19)):t}function Yd(t){let e=Wd(t).match(Gd);if(!e)throw new Error("Invalid Tabler SVG source");let[,n,r]=e,i=document.createElementNS(js,"svg"),o=Us(n);for(let[s,a]of Object.entries(o))s!=="class"&&i.setAttribute(s,a);for(let s of r.matchAll(qd)){let[,a,p]=s,c=document.createElementNS(js,a),u=Us(p);for(let[g,y]of Object.entries(u))c.setAttribute(g,y);i.appendChild(c)}return i}function Kd(t){let e=Vs.get(t);if(e)return e;let n=Yd(Ud[t]);return Vs.set(t,n),n}function Xr(t,e=20){let n=Kd(t).cloneNode(!0);return n.setAttribute("width",String(e)),n.setAttribute("height",String(e)),n.setAttribute("aria-hidden","true"),n.style.pointerEvents="none",n.style.flexShrink="0",n.style.verticalAlign="middle",n}function We(t,e,n){t.replaceChildren(Xr(e,n))}function ge(t,e,n,r){t.replaceChildren(Xr(e,r),document.createTextNode("\xA0"+n))}var Yo="5.0.22";function d(t,...e){let n="debug",r=[...e];e.length>0&&typeof e[e.length-1]=="string"&&["debug","info","warn","error"].includes(e[e.length-1])&&(n=r.pop());let i=`[Timekeeper v${Yo}]`;({debug:console.log,info:console.info,warn:console.warn,error:console.error})[n](`${i} ${t}`,...r)}function Vt(t,e=t){let n=Math.floor(t/3600),r=Math.floor(t%3600/60),i=String(t%60).padStart(2,"0");return e<3600?`${e>=600?String(r).padStart(2,"0"):r}:${i}`:`${e>=36e3?String(n).padStart(2,"0"):n}:${String(r).padStart(2,"0")}:${i}`}function Ii(t,e=window.location.href){try{let n=new URL(e);return n.searchParams.set("t",`${t}s`),n.toString()}catch{return`https://www.youtube.com/watch?v=${e.search(/[?&]v=/)>=0?e.split(/[?&]v=/)[1].split(/&/)[0]:e.split(/\/live\/|\/shorts\/|\?|&/)[1]}&t=${t}s`}}function Qn(){let t=new Date;return t.getUTCFullYear()+"-"+String(t.getUTCMonth()+1).padStart(2,"0")+"-"+String(t.getUTCDate()).padStart(2,"0")+"--"+String(t.getUTCHours()).padStart(2,"0")+"-"+String(t.getUTCMinutes()).padStart(2,"0")+"-"+String(t.getUTCSeconds()).padStart(2,"0")}var Gs=`#ytls-pane {
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
`;var ct=null,_r=null,Jd=250,Ut=null,Ar=!1,ut=null,Qr=[];function Xd(){return(!ct||!document.body.contains(ct))&&(ct=document.createElement("div"),ct.className="ytls-tooltip",ct.style.pointerEvents="none",document.body.appendChild(ct),window.addEventListener("scroll",qs,!0),window.addEventListener("resize",qs,!0)),ct}function Qd(t,e,n){let i=window.innerWidth,o=window.innerHeight,s=t.getBoundingClientRect(),a=s.width,p=s.height,c=e+10,u=n+10;c+a>i-10&&(c=e-a-10),u+p>o-10&&(u=n-p-10),c=Math.max(10,Math.min(c,i-a-10)),u=Math.max(10,Math.min(u,o-p-10)),t.style.left=`${c}px`,t.style.top=`${u}px`}function Zs(t,e){let r=window.innerWidth,i=window.innerHeight,o=e.getBoundingClientRect(),s=t.getBoundingClientRect(),a=s.width,p=s.height,c=Math.round(o.left+o.width/2-a/2),u=Math.round(o.top-p-8);u<8&&(u=Math.round(o.bottom+8)),c<8&&(c=Math.round(o.left)),c+a>r-8&&(c=Math.round(o.right-a)),c=Math.max(8,Math.min(c,r-a-8)),u=Math.max(8,Math.min(u,i-p-8)),t.style.left=`${c}px`,t.style.top=`${u}px`}function qs(){if(!(!ct||!Ut)&&ct.classList.contains("ytls-tooltip-visible"))try{Zs(ct,Ut)}catch{}}function ep(t=50){ut&&(clearTimeout(ut),ut=null),!Ar&&(ut=setTimeout(()=>{eo(),ut=null},t))}function tp(t,e,n,r){ut&&(clearTimeout(ut),ut=null),Ut&&r&&Ut!==r&&ct?.classList.contains("ytls-tooltip-visible")&&ct.classList.remove("ytls-tooltip-visible"),_r&&clearTimeout(_r),r&&(Ut=r,Ar=!0),_r=setTimeout(()=>{let i=Xd();i.textContent=t,i.classList.remove("ytls-tooltip-visible"),r?requestAnimationFrame(()=>{Zs(i,r),requestAnimationFrame(()=>{i.classList.add("ytls-tooltip-visible")})}):(Qd(i,e,n),requestAnimationFrame(()=>{i.classList.add("ytls-tooltip-visible")}))},Jd)}function eo(){_r&&(clearTimeout(_r),_r=null),ut&&(clearTimeout(ut),ut=null),ct&&ct.classList.remove("ytls-tooltip-visible"),Ut=null,Ar=!1}function Ci(){eo()}function dt(t,e){let n=0,r=0,i=c=>{n=c.clientX,r=c.clientY,ut&&(clearTimeout(ut),ut=null),Ar=!0,Ut=t;let u=typeof e=="function"?e():e;u&&tp(u,n,r,t)},o=c=>{n=c.clientX,r=c.clientY},s=()=>{Ut===t&&(Ar=!1,ep())};t.addEventListener("mouseenter",i),t.addEventListener("mousemove",o),t.addEventListener("mouseleave",s);let a=c=>{Ar=!1,Ut===t&&eo()};t.addEventListener("click",a,!0);let p=new MutationObserver(()=>{if(Ut===t)try{let c=window.getComputedStyle(t);(c.display==="none"||c.visibility==="hidden"||c.opacity==="0")&&eo()}catch{}});try{p.observe(t,{attributes:!0,attributeFilter:["class","style"]})}catch{}Qr.push(p),t.__tooltipCleanup=()=>{t.removeEventListener("mouseenter",i),t.removeEventListener("mousemove",o),t.removeEventListener("mouseleave",s),t.removeEventListener("click",a,!0);try{p.disconnect()}catch{}let c=Qr.indexOf(p);c!==-1&&Qr.splice(c,1),delete t.__tooltipObserver},t.__tooltipObserver=p}function Ws(){for(let t of Qr)try{t.disconnect()}catch{}Qr.length=0,eo()}var Hi={};Xa(Hi,{addTimestamp:()=>cp,buildExportCsvPayload:()=>vp,buildExportPayload:()=>hp,deleteSingleTimestampFromIndexedDB:()=>mp,exportAllTimestamps:()=>gp,exportAllTimestampsCsv:()=>yp,loadFromIndexedDB:()=>pp,loadGlobalSettings:()=>Qo,mergeBackupData:()=>bp,removeFromIndexedDB:()=>fp,saveGlobalSettings:()=>Xo,saveSingleTimestampToIndexedDB:()=>dp,saveToIndexedDB:()=>up});var np=U.string().min(1),Mr=U.object({guid:np,start:U.number().finite().nonnegative(),comment:U.string(),write_counter:U.number().int().positive().optional(),deleted_at:U.number().optional().catch(void 0)}),to=Mr.array(),Di=Mr.extend({video_id:U.string(),device_id:U.string().optional()}),Ks=U.object({x:U.number().finite(),y:U.number().finite(),width:U.number().finite().positive().optional(),height:U.number().finite().positive().optional()}),Ko=U.object({video_id:U.string(),timestamps:to}),Js=U.record(Ko),Ys=U.object({isSignedIn:U.boolean().catch(!1),accessToken:U.string().nullable().catch(null),userName:U.string().nullable().catch(null),email:U.string().nullable().catch(null)}),Bi=U.union([Ys,U.string().transform((t,e)=>{try{let n=JSON.parse(t);return Ys.parse(n)}catch{return e.addIssue({code:U.ZodIssueCode.custom,message:"Invalid JSON string for auth state"}),U.NEVER}})]).catch({isSignedIn:!1,accessToken:null,userName:null,email:null}),rp=U.object({autoBackupEnabled:U.boolean(),autoBackupIntervalMinutes:U.number().int().min(5).max(1440),lastAutoBackupAt:U.number().int().positive().nullable().optional()}),Ri=rp;var op="ytls-timestamps-db",ip=4,Lr="timestamps",Ke="timestamps_v2",Ye="settings",Ir=null,Cr=null;var Gt=null;function er(){if(Ir)try{return Ir.objectStoreNames,Promise.resolve(Ir)}catch(t){d("IndexedDB connection is no longer usable:",t,"warn"),Ir=null}return Cr||(Cr=ap().then(t=>(Ir=t,Cr=null,t.onclose=()=>{d("IndexedDB connection closed unexpectedly","warn"),Ir=null},t.onerror=e=>{d("IndexedDB connection error:",e,"error")},t)).catch(t=>{throw Cr=null,t}),Cr)}function Xs(t,e){let n=crypto.randomUUID(),r=0,i=t.openCursor();i.onsuccess=o=>{let s=o.target.result;s?(r++,s.update({...s.value,write_counter:r,device_id:n}),s.continue()):(e.put({key:"write_counter",value:r}),e.put({key:"device_id",value:n}),d(`Lamport migration: backfilled ${r} records, device_id=${n}`))},i.onerror=()=>{d("Lamport migration: cursor error during backfill",i.error,"error")}}function ap(){return new Promise((t,e)=>{let n=indexedDB.open(op,ip);n.onupgradeneeded=r=>{let i=r.target.result,o=r.oldVersion,s=r.target.transaction;if(o<1&&i.createObjectStore(Lr,{keyPath:"video_id"}),o<2&&!i.objectStoreNames.contains(Ye)&&i.createObjectStore(Ye,{keyPath:"key"}),o<3){if(i.objectStoreNames.contains(Lr)){d("Exporting backup before v2 migration...");let c=s.objectStore(Lr).getAll();c.onsuccess=()=>{let u=Ko.array().safeParse(c.result);if(u.success&&u.data.length>0)try{let g={},y=0;u.data.forEach(N=>{if(N.timestamps.length>0){let J=to.parse(N.timestamps);g[`ytls-${N.video_id}`]={video_id:N.video_id,timestamps:[...J].sort((C,B)=>C.start-B.start)},y+=J.length}});let A=new Blob([JSON.stringify(g,null,2)],{type:"application/json"}),R=URL.createObjectURL(A),j=document.createElement("a");j.href=R,j.download=`timekeeper-data-${Qn()}.json`,j.click(),URL.revokeObjectURL(R),d(`Pre-migration backup exported: ${u.data.length} videos, ${y} timestamps`)}catch(g){d("Failed to export pre-migration backup:",g,"error")}else u.success||d("Skipping pre-migration backup: legacy data failed validation",u.error.format(),"warn")}}let a=i.createObjectStore(Ke,{keyPath:"guid"});if(a.createIndex("video_id","video_id",{unique:!1}),a.createIndex("video_start",["video_id","start"],{unique:!1}),i.objectStoreNames.contains(Lr)){let c=s.objectStore(Lr).getAll();c.onsuccess=()=>{let u=Ko.array().safeParse(c.result);if(u.success&&u.data.length>0){let g=0;u.data.forEach(y=>{y.timestamps.length>0&&y.timestamps.forEach(A=>{a.put({guid:A.guid,video_id:y.video_id,start:A.start,comment:A.comment}),g++})}),d(`Migrated ${g} timestamps from ${u.data.length} videos to v2 store`)}else u.success||d("Skipping v1 \u2192 v2 migration: legacy data failed validation",u.error.format(),"warn");o<4&&Xs(s.objectStore(Ke),s.objectStore(Ye))},i.deleteObjectStore(Lr),d("Deleted old timestamps store after migration to v2")}}o===3&&Xs(s.objectStore(Ke),s.objectStore(Ye))},n.onsuccess=r=>{t(r.target.result)},n.onerror=r=>{let i=r.target.error;e(i??new Error("Failed to open IndexedDB"))}})}function Pi(t,e,n){return er().then(r=>new Promise((i,o)=>{let s;try{s=r.transaction(t,e)}catch(c){o(new Error(`Failed to create transaction for ${t}: ${c}`));return}let a=s.objectStore(t),p;try{p=n(a)}catch(c){o(new Error(`Failed to execute operation on ${t}: ${c}`));return}p&&(p.onsuccess=()=>i(p.result),p.onerror=()=>o(p.error??new Error(`IndexedDB ${e} operation failed`))),s.oncomplete=()=>{p||i(void 0)},s.onerror=()=>o(s.error??new Error("IndexedDB transaction failed")),s.onabort=()=>o(s.error??new Error("IndexedDB transaction aborted"))}))}function Qs(t,e){let n=to.safeParse(e);if(!n.success)return Promise.reject(new Error(`Invalid timestamp payload for ${t}`));let r=n.data;return er().then(i=>new Promise((o,s)=>{let a;try{a=i.transaction([Ke,Ye],"readwrite")}catch(y){s(new Error(`Failed to create transaction: ${y}`));return}a.oncomplete=()=>o(),a.onerror=()=>s(new Error(`IndexedDB save failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>s(new Error("IndexedDB transaction aborted"));let p=a.objectStore(Ke),c=a.objectStore(Ye),g=p.index("video_id").getAll(IDBKeyRange.only(t));g.onsuccess=()=>{try{let y=g.result??[],A=new Map(y.map(C=>[C.guid,C])),R=new Set(r.map(C=>C.guid)),j=Date.now(),N,J=c.get("write_counter");J.onsuccess=()=>{try{N=typeof J.result?.value=="number"?J.result.value:0}catch{N=0}y.forEach(C=>{!R.has(C.guid)&&!C.deleted_at&&(N++,p.put({...C,deleted_at:j,write_counter:N}))}),r.forEach(C=>{let B=A.get(C.guid);if(B&&!B.deleted_at&&B.start===C.start&&B.comment===C.comment&&B.deleted_at===C.deleted_at)p.put({guid:C.guid,video_id:t,start:C.start,comment:C.comment,write_counter:B.write_counter,deleted_at:C.deleted_at,device_id:B.device_id});else{N++;let ue=C.deleted_at??B?.deleted_at??void 0;p.put({guid:C.guid,video_id:t,start:C.start,comment:C.comment,write_counter:N,deleted_at:ue})}}),c.put({key:"write_counter",value:N}),Gt=N},J.onerror=()=>{d("Failed to read write_counter during save, proceeding with counter=0",J.error,"warn"),N=0,y.forEach(C=>{!R.has(C.guid)&&!C.deleted_at&&(N++,p.put({...C,deleted_at:j,write_counter:N}))}),r.forEach(C=>{let B=A.get(C.guid);if(B&&!B.deleted_at&&B.start===C.start&&B.comment===C.comment&&B.deleted_at===C.deleted_at)p.put({guid:C.guid,video_id:t,start:C.start,comment:C.comment,write_counter:B.write_counter,deleted_at:C.deleted_at,device_id:B.device_id});else{N++;let ue=C.deleted_at??B?.deleted_at??void 0;p.put({guid:C.guid,video_id:t,start:C.start,comment:C.comment,write_counter:N,deleted_at:ue})}}),c.put({key:"write_counter",value:N}),Gt=N}}catch(y){s(y instanceof Error?y:new Error(String(y)))}},g.onerror=()=>{let y=`Failed to load existing records for save: ${g.error?.message??"unknown"}`;d(y,g.error,"error"),s(new Error(y))}}))}function el(t,e){let n=Mr.safeParse(e);if(!n.success)return Promise.reject(new Error(`Invalid timestamp: ${n.error.message}`));let r=n.data;return er().then(i=>new Promise((o,s)=>{let a;try{a=i.transaction([Ke,Ye],"readwrite")}catch(g){s(new Error(`Failed to create transaction: ${g}`));return}a.oncomplete=()=>o(),a.onerror=()=>s(new Error(`IndexedDB save failed: ${a.error?.message??"unknown"}`)),a.onabort=()=>s(new Error("IndexedDB transaction aborted"));let p=a.objectStore(Ke),c=a.objectStore(Ye);p.put({guid:r.guid,video_id:t,start:r.start,comment:r.comment,write_counter:0,deleted_at:r.deleted_at});let u=c.get("write_counter");u.onsuccess=()=>{try{let g=typeof u.result?.value=="number"?u.result.value:0;p.put({guid:r.guid,video_id:t,start:r.start,comment:r.comment,write_counter:g+1,deleted_at:r.deleted_at}),c.put({key:"write_counter",value:g+1}),Gt=g+1}catch(g){s(g instanceof Error?g:new Error(String(g)))}},u.onerror=()=>{p.put({guid:r.guid,video_id:t,start:r.start,comment:r.comment,write_counter:1,deleted_at:r.deleted_at}),c.put({key:"write_counter",value:1}),Gt=1}}))}function tl(t){return t.length===0?Promise.resolve():er().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke,Ye],"readwrite")}catch(c){r(new Error(`Failed to create transaction: ${c}`));return}i.oncomplete=()=>n(),i.onerror=()=>r(new Error(`IndexedDB batch save failed: ${i.error?.message??"unknown"}`)),i.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=i.objectStore(Ke),s=i.objectStore(Ye),a=0;t.forEach(c=>{c.write_counter!==void 0&&c.write_counter>a&&(a=c.write_counter)}),t.forEach(c=>{let u={guid:c.guid,video_id:c.video_id,start:c.start,comment:c.comment,deleted_at:c.deleted_at};c.write_counter===void 0?(a++,u.write_counter=a):u.write_counter=c.write_counter,o.put(u)});let p=s.get("write_counter");p.onsuccess=()=>{try{let c=typeof p.result?.value=="number"?p.result.value:0,u=Math.max(a,c)+1;s.put({key:"write_counter",value:u}),Gt=u}catch(c){r(c instanceof Error?c:new Error(String(c)))}},p.onerror=()=>{s.put({key:"write_counter",value:a+1}),Gt=a+1}}))}function nl(t){return d(`Soft-deleting timestamp ${t}`),er().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke,Ye],"readwrite")}catch(p){r(new Error(`Failed to create transaction: ${p}`));return}i.oncomplete=()=>n(),i.onerror=()=>r(new Error(`IndexedDB delete failed: ${i.error?.message??"unknown"}`)),i.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=i.objectStore(Ke),s=i.objectStore(Ye),a=o.get(t);a.onsuccess=()=>{try{let p=a.result;if(p){let c=s.get("write_counter");c.onsuccess=()=>{try{let u=typeof c.result?.value=="number"?c.result.value:0;o.put({...p,deleted_at:Date.now(),write_counter:u+1}),s.put({key:"write_counter",value:u+1}),Gt=u+1}catch(u){r(u instanceof Error?u:new Error(String(u)))}},c.onerror=()=>{o.put({...p,deleted_at:Date.now(),write_counter:1}),s.put({key:"write_counter",value:1}),Gt=1}}}catch(p){r(p instanceof Error?p:new Error(String(p)))}},a.onerror=()=>{let p=`Failed to load record for deletion: ${a.error?.message??"unknown"}`;d(p,a.error,"error"),r(new Error(p))}}))}function rl(t){return er().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke],"readonly")}catch(s){let a=`Failed to create read transaction: ${s}`;d(a,s,"error"),r(new Error(a));return}i.onabort=()=>{let s=`Transaction aborted during load: ${i.error?.message??"unknown"}`;d(s,i.error,"error"),r(new Error(s))};let o=i.objectStore(Ke).index("video_id").getAll(IDBKeyRange.only(t));o.onsuccess=()=>{try{let s=o.result.filter(c=>!c.deleted_at);if(s.length===0){n(null);return}let a=s.map(c=>({guid:c.guid,start:c.start,comment:c.comment})),p=to.safeParse(a);if(!p.success){d("Failed to parse timestamps from IndexedDB:",p.error.format(),"warn"),n(null);return}n([...p.data].sort((c,u)=>c.start-u.start))}catch(s){r(s)}},o.onerror=()=>{let s=`Failed to load timestamps from IndexedDB: ${o.error?.message??"unknown error"}`;d(s,o.error,"error"),r(new Error(s))}}))}function ol(t){return er().then(e=>new Promise((n,r)=>{let i;try{i=e.transaction([Ke,Ye],"readwrite")}catch(c){r(new Error(`Failed to create transaction: ${c}`));return}i.oncomplete=()=>n(),i.onerror=()=>r(new Error(`IndexedDB delete failed: ${i.error?.message??"unknown"}`)),i.onabort=()=>r(new Error("IndexedDB transaction aborted"));let o=i.objectStore(Ke),s=i.objectStore(Ye),p=o.index("video_id").getAll(IDBKeyRange.only(t));p.onsuccess=()=>{try{let c=p.result??[],u=Date.now(),g=s.get("write_counter");g.onsuccess=()=>{try{let y;y=typeof g.result?.value=="number"?g.result.value:0,c.forEach(A=>{A.deleted_at||(y++,o.put({...A,deleted_at:u,write_counter:y}))}),s.put({key:"write_counter",value:y}),Gt=y}catch(y){r(y instanceof Error?y:new Error(String(y)))}},g.onerror=()=>{let y=0;c.forEach(A=>{A.deleted_at||(y++,o.put({...A,deleted_at:u,write_counter:y}))}),s.put({key:"write_counter",value:y}),Gt=y}}catch(c){r(c instanceof Error?c:new Error(String(c)))}},p.onerror=()=>{let c=`Failed to load records for deletion: ${p.error?.message??"unknown"}`;d(c,p.error,"error"),r(new Error(c))}}))}function Jo(){return Pi(Ke,"readonly",t=>t.getAll()).then(t=>Array.isArray(t)?t:[])}function il(t,e){return Pi(Ye,"readwrite",n=>{n.put({key:t,value:e})}).then(()=>{}).catch(n=>{d(`Failed to save setting '${t}' to IndexedDB:`,n,"error")})}function al(t){return Pi(Ye,"readonly",e=>e.get(t)).then(e=>e?.value).catch(e=>{d(`Failed to load setting '${t}' from IndexedDB:`,e,"error")})}async function Oi({includeDeleted:t=!1}={}){let e={},n=await Jo(),r=Di.array().safeParse(n);if(!r.success)return d("Failed to parse timestamp rows for export:",r.error.format(),"warn"),{json:"{}",filename:"timekeeper-data.json",totalVideos:0,totalTimestamps:0};let o=[...t?r.data:r.data.filter(u=>!u.deleted_at)].sort((u,g)=>{let y=u.video_id.localeCompare(g.video_id);if(y!==0)return y;let A=u.start-g.start;return A!==0?A:u.guid.localeCompare(g.guid)}),s=new Map;for(let u of o)s.has(u.video_id)||s.set(u.video_id,[]),s.get(u.video_id).push({guid:u.guid,start:u.start,comment:u.comment,write_counter:u.write_counter,deleted_at:u.deleted_at});let a=Array.from(s.keys()).sort((u,g)=>u.localeCompare(g));for(let u of a){let g=s.get(u);e[`ytls-${u}`]={video_id:u,timestamps:g}}return{json:JSON.stringify(e,null,2),filename:"timekeeper-data.json",totalVideos:s.size,totalTimestamps:o.length}}async function sl(){try{let{json:t,filename:e,totalVideos:n,totalTimestamps:r}=await Oi(),i=new Blob([t],{type:"application/json"}),o=URL.createObjectURL(i),s=document.createElement("a");s.href=o,s.download=e,s.click(),URL.revokeObjectURL(o),d(`Exported ${n} videos with ${r} timestamps`)}catch(t){throw d("Failed to export data:",t,"error"),t}}async function Ni(){let t=Di.array().safeParse((await Jo()).filter(u=>!u.deleted_at));if(!t.success||t.data.length===0){t.success||d("Failed to parse timestamp rows for CSV export:",t.error.format(),"warn");let u=`Tag,Timestamp,URL
`,g=`timestamps-${Qn()}.csv`;return{csv:u,filename:g,totalVideos:0,totalTimestamps:0}}let e=t.data,n=new Map;for(let u of e)n.has(u.video_id)||n.set(u.video_id,[]),n.get(u.video_id).push({start:u.start,comment:u.comment});let r=[];r.push("Tag,Timestamp,URL");let i=0,o=u=>`"${String(u).replace(/"/g,'""')}"`,s=u=>{let g=Math.floor(u/3600),y=Math.floor(u%3600/60),A=String(u%60).padStart(2,"0");return`${String(g).padStart(2,"0")}:${String(y).padStart(2,"0")}:${A}`},a=Array.from(n.keys()).sort();for(let u of a){let g=n.get(u).sort((y,A)=>y.start-A.start);for(let y of g){let A=y.comment,R=s(y.start),j=Ii(y.start,`https://www.youtube.com/watch?v=${u}`);r.push([o(A),o(R),o(j)].join(",")),i++}}let p=r.join(`
`),c=`timestamps-${Qn()}.csv`;return{csv:p,filename:c,totalVideos:n.size,totalTimestamps:i}}async function ll(){try{let{csv:t,filename:e,totalVideos:n,totalTimestamps:r}=await Ni(),i=new Blob([t],{type:"text/csv;charset=utf-8;"}),o=URL.createObjectURL(i),s=document.createElement("a");s.href=o,s.download=e,s.click(),URL.revokeObjectURL(o),d(`Exported ${n} videos with ${r} timestamps (CSV)`)}catch(t){throw d("Failed to export CSV data:",t,"error"),t}}async function zi(t,e){if(!t)throw new Error("Video ID is required");if(!e.guid||e.start==null)throw new Error("Timestamp must have GUID and start time");return el(t,e)}async function cl(t,e){if(!t)throw new Error("Video ID is required");if(!Array.isArray(e))throw new Error("Timestamps must be an array");return Qs(t,e)}async function ul(t){if(!t)throw new Error("GUID is required");return nl(t)}async function dl(t){if(!t)throw new Error("Video ID is required");return ol(t)}async function pl(t){if(!t)throw new Error("Video ID is required");return rl(t)}async function ml(t){let e;try{e=JSON.parse(t)}catch{return d("mergeBackupData: failed to parse JSON",null,"warn"),{mergedVideos:0,mergedTimestamps:0}}let n=Js.safeParse(e);if(!n.success)return d("mergeBackupData: data failed validation",n.error.format(),"warn"),{mergedVideos:0,mergedTimestamps:0};let r=await Jo(),i=new Map;for(let p of r)i.set(p.guid,p);let o=0,s=0,a=[];for(let[,p]of Object.entries(n.data)){let{video_id:c,timestamps:u}=p,g=0;for(let y of u){let A=i.get(y.guid),R=!1;A?A.write_counter!==void 0&&y.write_counter!==void 0&&y.write_counter>A.write_counter&&(R=!0):R=!0,R&&(a.push({guid:y.guid,video_id:c,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),i.set(y.guid,{...A??{},guid:y.guid,video_id:c,start:y.start,comment:y.comment,write_counter:y.write_counter,deleted_at:y.deleted_at}),g++,s++)}g>0&&o++}return await tl(a),{mergedVideos:o,mergedTimestamps:s}}function fl(t,e){if(!t)throw new Error("Setting key is required");return il(t,e)}async function hl(t){if(!t)throw new Error("Setting key is required");return al(t)}function cp(t,e){return zi(t,e)}function up(t,e){return cl(t,e)}function dp(t,e){return zi(t,e)}function pp(t){return pl(t)}function mp(t,e){return ul(e)}function fp(t){return dl(t)}function Xo(t,e){fl(t,e)}function Qo(t){return hl(t)}function hp(t){return Oi(t)}function gp(){return sl()}function vp(){return Ni()}function yp(){return ll()}function bp(t){return ml(t)}var wp=!1,xp=null;function ei(t){return t?Array.from(t.querySelectorAll("li:not(.ytls-placeholder):not(.ytls-error-message)")):[]}function ti(t){if(!t)return;t.replaceChildren(),xp=null;let e=t.querySelector(".ytls-error-message");e&&e.remove()}function $i(t,e){if(!t)return;ti(t);let n=document.createElement("li");n.className="ytls-placeholder",n.textContent=e,t.appendChild(n),t.style.overflowY="hidden"}function gl(t){if(!t)return;let e=t.querySelector(".ytls-placeholder");e&&e.remove(),t.style.overflowY=""}function no(t){return t?t.querySelector(".ytls-error-message")!==null:!1}function vl(t,e){if(!t)return;ti(t);let n=document.createElement("li");n.className="ytls-error-message",n.style.cssText=`
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
  `,n.innerHTML=`<div style="margin-bottom:8px">\u26A0\uFE0F ${kp(e)}</div><div style="font-size:12px;font-weight:normal;color:#aaa">Check the console for details or refresh the page.</div>`,t.appendChild(n),t.style.overflowY="hidden"}function yl(t){if(!t)return;let e=t.querySelector(".ytls-error-message");e&&e.remove()}function kp(t){let e=document.createElement("div");return e.textContent=t,e.innerHTML}function bl(t,e){if(!t||e||no(t))return;Array.from(t.children).some(r=>!r.classList.contains("ytls-placeholder")&&!r.classList.contains("ytls-error-message"))||$i(t,"No timestamps for this video")}function wl(t){if(!t)return[];let e=ei(t),n=[];return e.forEach(r=>{let i=r.querySelector("[data-time]"),o=r.querySelector("input"),s=r.dataset.guid;if(!i||!o||!s)return;let a=i.dataset.time;if(!a)return;let p=Number.parseInt(a,10);Number.isFinite(p)&&n.push({guid:s,start:p,comment:o.value})}),n.sort((r,i)=>r.start-i.start)}function ro(t){wp=t}function xl(t){if(!t)return 0;let e=ei(t),n=0;return e.forEach(r=>{let o=r.querySelector("[data-time]")?.dataset.time;if(o){let s=Number.parseInt(o,10);Number.isFinite(s)&&(n=Math.max(n,s))}}),n}var Sp={auth:{googleAuthState:{isSignedIn:!1,accessToken:null,userName:null,email:null},autoBackupEnabled:!0,autoBackupIntervalMinutes:30,autoBackupRetryAttempts:0,autoBackupBackoffMs:null,lastAutoBackupAt:null,isAutoBackupRunning:!1},ui:{panePosition:null,currentVideoId:"",minPaneHeight:250,lastHandledUrl:null,urlChangeHandlersSetup:!1},timestamps:{items:[],currentIndex:null,dbError:null}},Je=JSON.parse(JSON.stringify(Sp)),kl=new Set;function ze(){return Je}function oo(t){let e=kl.size>0?JSON.parse(JSON.stringify(Je)):Je;Je={...Je,...t,auth:{...Je.auth,...t.auth||{}},ui:{...Je.ui,...t.ui||{}},timestamps:{...Je.timestamps,...t.timestamps||{}}},Ep(e)}function tr(t,e){oo({auth:{...Je.auth,[t]:e}})}function ni(t,e){oo({ui:{...Je.ui,[t]:e}})}function qt(){return Je.auth.googleAuthState}function Bt(t){tr("googleAuthState",t)}function Fi(t){tr("autoBackupEnabled",t)}function ji(t){tr("autoBackupIntervalMinutes",t)}function Vi(t){tr("isAutoBackupRunning",t)}function ri(t){tr("autoBackupRetryAttempts",t)}function Dr(t){tr("autoBackupBackoffMs",t)}function Ui(t){tr("lastAutoBackupAt",t)}function Tl(t){ni("minPaneHeight",t)}function Sl(t){ni("panePosition",t)}function El(t){ni("lastHandledUrl",t)}function _l(t){ni("urlChangeHandlersSetup",t)}function Al(t){oo({timestamps:{...Je.timestamps,items:t}})}function Ml(t){oo({timestamps:{...Je.timestamps,currentIndex:t}})}function Gi(t){oo({timestamps:{...Je.timestamps,dbError:t}})}function Ll(){return Je.timestamps.dbError}function Ep(t){kl.forEach(e=>{try{e(Je,t)}catch(n){console.error("Error in state listener:",n)}})}var Ol=43200*14,Cl="html5_max_live_dvr_window_plus_margin_secs";function an(t){return t!=null&&typeof t=="object"}function Dl(t){let{streamingData:e,videoDetails:n,playerConfig:r,microformat:i}=t;if(!(!an(n)||!n.isLive)){if(n.isLiveDvrEnabled=!0,an(r)){let o=r.mediaCommonConfig;if(an(o)){o.useServerDrivenAbr=!1;let s=o.serverPlaybackStartConfig;an(s)&&(s.enable=!1)}}if(an(e)){let o=e;if(o.serverAbrStreamingUrl&&(o.hlsManifestUrl||o.dashManifestUrl)&&delete o.serverAbrStreamingUrl,Array.isArray(o.adaptiveFormats)&&_p(i))for(let s of o.adaptiveFormats)s.maxDvrDurationSec=Ol}}}function _p(t){if(!an(t))return!1;let e=t.playerMicroformatRenderer;if(!an(e))return!1;let n=e.liveBroadcastDetails;if(!an(n))return!1;let r=n.startTimestamp;return!r||typeof r!="string"?!1:(Date.now()-new Date(r).getTime())/1e3>43200}function qi(t){if(!t||typeof t!="object")return!1;let e=t;return e.videoDetails?(Dl(e),!0):e.playerResponse&&an(e.playerResponse)&&e.playerResponse.videoDetails?(Dl(e.playerResponse),!0):!1}function Ap(){let t=Object.getOwnPropertyDescriptor(window,"ytInitialPlayerResponse"),e=t&&t.set,n=window.ytInitialPlayerResponse;if(!qi(n))try{Object.defineProperty(window,"ytInitialPlayerResponse",{configurable:!0,get(){return n},set(r){e&&e.call(this,r),n=r,qi(r)&&Object.defineProperty(window,"ytInitialPlayerResponse",{configurable:!0,writable:!0,value:r})}})}catch{}}var Bl=!1;function Mp(){if(Bl)return;Bl=!0;let t=JSON.parse;JSON.parse=function(e,n){let r=t.call(this,e,n);try{qi(r)}catch{}return r}}function Rl(t){if(t.__dvrCapLifted)return;let n=(typeof t.d=="function"?t.d():void 0)?.WEB_PLAYER_CONTEXT_CONFIGS;if(!n)return;let r=n;for(let i in r){let o=r[i];if(o&&typeof o.serializedExperimentFlags=="string"){let s=o.serializedExperimentFlags,a=s.replace(new RegExp(`${Cl}=[\\d.]+`),`${Cl}=${Ol}`);a!==s&&(o.serializedExperimentFlags=a)}}t.__dvrCapLifted=!0}function Pl(t){if(!t||t.__dvrHooked)return t;t.__dvrHooked=!0;let e=t.set;typeof e=="function"&&(t.set=function(...n){let r=e.apply(this,n);try{Rl(t)}catch{}return r});try{Rl(t)}catch{}return t}function Lp(){let t={};window.ytcfg&&(t=Pl(window.ytcfg));try{Object.defineProperty(window,"ytcfg",{configurable:!0,get(){return t},set(e){t=Pl(e)}})}catch{}}function Nl(){Ap(),Mp(),Lp(),d("[Timekeeper] DVR/Rewind enablement initialized for live streams")}var Te=Uint8Array,ht=Uint16Array,ra=Int32Array,oi=new Te([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),ii=new Te([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Ji=new Te([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ul=function(t,e){for(var n=new ht(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new ra(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},Gl=Ul(oi,2),ql=Gl.b,Xi=Gl.r;ql[28]=258,Xi[258]=28;var Zl=Ul(ii,0),Ip=Zl.b,zl=Zl.r,Qi=new ht(32768);for(le=0;le<32768;++le)sn=(le&43690)>>1|(le&21845)<<1,sn=(sn&52428)>>2|(sn&13107)<<2,sn=(sn&61680)>>4|(sn&3855)<<4,Qi[le]=((sn&65280)>>8|(sn&255)<<8)>>1;var sn,le,Wt=(function(t,e,n){for(var r=t.length,i=0,o=new ht(e);i<r;++i)t[i]&&++o[t[i]-1];var s=new ht(e);for(i=1;i<e;++i)s[i]=s[i-1]+o[i-1]<<1;var a;if(n){a=new ht(1<<e);var p=15-e;for(i=0;i<r;++i)if(t[i])for(var c=i<<4|t[i],u=e-t[i],g=s[t[i]-1]++<<u,y=g|(1<<u)-1;g<=y;++g)a[Qi[g]>>p]=c}else for(a=new ht(r),i=0;i<r;++i)t[i]&&(a[i]=Qi[s[t[i]-1]++]>>15-t[i]);return a}),Sn=new Te(288);for(le=0;le<144;++le)Sn[le]=8;var le;for(le=144;le<256;++le)Sn[le]=9;var le;for(le=256;le<280;++le)Sn[le]=7;var le;for(le=280;le<288;++le)Sn[le]=8;var le,so=new Te(32);for(le=0;le<32;++le)so[le]=5;var le,Cp=Wt(Sn,9,0),Dp=Wt(Sn,9,1),Bp=Wt(so,5,0),Rp=Wt(so,5,1),Zi=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},Rt=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},Wi=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},oa=function(t){return(t+7)/8|0},lo=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new Te(t.subarray(e,n))};var Pp=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],rt=function(t,e,n){var r=new Error(e||Pp[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,rt),!n)throw r;return r},Op=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new Te(0);var s=!n,a=s||e.i!=2,p=e.i;s&&(n=new Te(i*3));var c=function(Mn){var cn=n.length;if(Mn>cn){var un=new Te(Math.max(cn*2,Mn));un.set(n),n=un}},u=e.f||0,g=e.p||0,y=e.b||0,A=e.l,R=e.d,j=e.m,N=e.n,J=i*8;do{if(!A){u=Rt(t,g,1);var C=Rt(t,g+1,3);if(g+=3,C)if(C==1)A=Dp,R=Rp,j=9,N=5;else if(C==2){var Ee=Rt(t,g,31)+257,we=Rt(t,g+10,15)+4,X=Ee+Rt(t,g+5,31)+1;g+=14;for(var V=new Te(X),De=new Te(19),xe=0;xe<we;++xe)De[Ji[xe]]=Rt(t,g+xe*3,7);g+=we*3;for(var He=Zi(De),Kt=(1<<He)-1,Le=Wt(De,He,1),xe=0;xe<X;){var Be=Le[Rt(t,g,Kt)];g+=Be&15;var B=Be>>4;if(B<16)V[xe++]=B;else{var ke=0,he=0;for(B==16?(he=3+Rt(t,g,3),g+=2,ke=V[xe-1]):B==17?(he=3+Rt(t,g,7),g+=3):B==18&&(he=11+Rt(t,g,127),g+=7);he--;)V[xe++]=ke}}var $e=V.subarray(0,Ee),Ie=V.subarray(Ee);j=Zi($e),N=Zi(Ie),A=Wt($e,j,1),R=Wt(Ie,N,1)}else rt(1);else{var B=oa(g)+4,ae=t[B-4]|t[B-3]<<8,ue=B+ae;if(ue>i){p&&rt(0);break}a&&c(y+ae),n.set(t.subarray(B,ue),y),e.b=y+=ae,e.p=g=ue*8,e.f=u;continue}if(g>J){p&&rt(0);break}}a&&c(y+131072);for(var _n=(1<<j)-1,Xe=(1<<N)-1,Tt=g;;Tt=g){var ke=A[Wi(t,g)&_n],Re=ke>>4;if(g+=ke&15,g>J){p&&rt(0);break}if(ke||rt(2),Re<256)n[y++]=Re;else if(Re==256){Tt=g,A=null;break}else{var Ae=Re-254;if(Re>264){var xe=Re-257,ie=oi[xe];Ae=Rt(t,g,(1<<ie)-1)+ql[xe],g+=ie}var Pe=R[Wi(t,g)&Xe],Ge=Pe>>4;Pe||rt(3),g+=Pe&15;var Ie=Ip[Ge];if(Ge>3){var ie=ii[Ge];Ie+=Wi(t,g)&(1<<ie)-1,g+=ie}if(g>J){p&&rt(0);break}a&&c(y+131072);var St=y+Ae;if(y<Ie){var An=o-Ie,or=Math.min(Ie,St);for(An+y<0&&rt(3);y<or;++y)n[y]=r[An+y]}for(;y<St;++y)n[y]=n[y-Ie]}}e.l=A,e.p=Tt,e.b=y,e.f=u,A&&(u=1,e.m=j,e.d=R,e.n=N)}while(!u);return y!=n.length&&s?lo(n,0,y):n.subarray(0,y)},ln=function(t,e,n){n<<=e&7;var r=e/8|0;t[r]|=n,t[r+1]|=n>>8},io=function(t,e,n){n<<=e&7;var r=e/8|0;t[r]|=n,t[r+1]|=n>>8,t[r+2]|=n>>16},Yi=function(t,e){for(var n=[],r=0;r<t.length;++r)t[r]&&n.push({s:r,f:t[r]});var i=n.length,o=n.slice();if(!i)return{t:Yl,l:0};if(i==1){var s=new Te(n[0].s+1);return s[n[0].s]=1,{t:s,l:1}}n.sort(function(ue,Ee){return ue.f-Ee.f}),n.push({s:-1,f:25001});var a=n[0],p=n[1],c=0,u=1,g=2;for(n[0]={s:-1,f:a.f+p.f,l:a,r:p};u!=i-1;)a=n[n[c].f<n[g].f?c++:g++],p=n[c!=u&&n[c].f<n[g].f?c++:g++],n[u++]={s:-1,f:a.f+p.f,l:a,r:p};for(var y=o[0].s,r=1;r<i;++r)o[r].s>y&&(y=o[r].s);var A=new ht(y+1),R=ea(n[u-1],A,0);if(R>e){var r=0,j=0,N=R-e,J=1<<N;for(o.sort(function(Ee,we){return A[we.s]-A[Ee.s]||Ee.f-we.f});r<i;++r){var C=o[r].s;if(A[C]>e)j+=J-(1<<R-A[C]),A[C]=e;else break}for(j>>=N;j>0;){var B=o[r].s;A[B]<e?j-=1<<e-A[B]++-1:++r}for(;r>=0&&j;--r){var ae=o[r].s;A[ae]==e&&(--A[ae],++j)}R=e}return{t:new Te(A),l:R}},ea=function(t,e,n){return t.s==-1?Math.max(ea(t.l,e,n+1),ea(t.r,e,n+1)):e[t.s]=n},Hl=function(t){for(var e=t.length;e&&!t[--e];);for(var n=new ht(++e),r=0,i=t[0],o=1,s=function(p){n[r++]=p},a=1;a<=e;++a)if(t[a]==i&&a!=e)++o;else{if(!i&&o>2){for(;o>138;o-=138)s(32754);o>2&&(s(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(s(i),--o;o>6;o-=6)s(8304);o>2&&(s(o-3<<5|8208),o=0)}for(;o--;)s(i);o=1,i=t[a]}return{c:n.subarray(0,r),n:e}},ao=function(t,e){for(var n=0,r=0;r<e.length;++r)n+=t[r]*e[r];return n},Wl=function(t,e,n){var r=n.length,i=oa(e+2);t[i]=r&255,t[i+1]=r>>8,t[i+2]=t[i]^255,t[i+3]=t[i+1]^255;for(var o=0;o<r;++o)t[i+o+4]=n[o];return(i+4+r)*8},$l=function(t,e,n,r,i,o,s,a,p,c,u){ln(e,u++,n),++i[256];for(var g=Yi(i,15),y=g.t,A=g.l,R=Yi(o,15),j=R.t,N=R.l,J=Hl(y),C=J.c,B=J.n,ae=Hl(j),ue=ae.c,Ee=ae.n,we=new ht(19),X=0;X<C.length;++X)++we[C[X]&31];for(var X=0;X<ue.length;++X)++we[ue[X]&31];for(var V=Yi(we,7),De=V.t,xe=V.l,He=19;He>4&&!De[Ji[He-1]];--He);var Kt=c+5<<3,Le=ao(i,Sn)+ao(o,so)+s,Be=ao(i,y)+ao(o,j)+s+14+3*He+ao(we,De)+2*we[16]+3*we[17]+7*we[18];if(p>=0&&Kt<=Le&&Kt<=Be)return Wl(e,u,t.subarray(p,p+c));var ke,he,$e,Ie;if(ln(e,u,1+(Be<Le)),u+=2,Be<Le){ke=Wt(y,A,0),he=y,$e=Wt(j,N,0),Ie=j;var _n=Wt(De,xe,0);ln(e,u,B-257),ln(e,u+5,Ee-1),ln(e,u+10,He-4),u+=14;for(var X=0;X<He;++X)ln(e,u+3*X,De[Ji[X]]);u+=3*He;for(var Xe=[C,ue],Tt=0;Tt<2;++Tt)for(var Re=Xe[Tt],X=0;X<Re.length;++X){var Ae=Re[X]&31;ln(e,u,_n[Ae]),u+=De[Ae],Ae>15&&(ln(e,u,Re[X]>>5&127),u+=Re[X]>>12)}}else ke=Cp,he=Sn,$e=Bp,Ie=so;for(var X=0;X<a;++X){var ie=r[X];if(ie>255){var Ae=ie>>18&31;io(e,u,ke[Ae+257]),u+=he[Ae+257],Ae>7&&(ln(e,u,ie>>23&31),u+=oi[Ae]);var Pe=ie&31;io(e,u,$e[Pe]),u+=Ie[Pe],Pe>3&&(io(e,u,ie>>5&8191),u+=ii[Pe])}else io(e,u,ke[ie]),u+=he[ie]}return io(e,u,ke[256]),u+he[256]},Np=new ra([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Yl=new Te(0),zp=function(t,e,n,r,i,o){var s=o.z||t.length,a=new Te(r+s+5*(1+Math.ceil(s/7e3))+i),p=a.subarray(r,a.length-i),c=o.l,u=(o.r||0)&7;if(e){u&&(p[0]=o.r>>3);for(var g=Np[e-1],y=g>>13,A=g&8191,R=(1<<n)-1,j=o.p||new ht(32768),N=o.h||new ht(R+1),J=Math.ceil(n/3),C=2*J,B=function(Or){return(t[Or]^t[Or+1]<<J^t[Or+2]<<C)&R},ae=new ra(25e3),ue=new ht(288),Ee=new ht(32),we=0,X=0,V=o.i||0,De=0,xe=o.w||0,He=0;V+2<s;++V){var Kt=B(V),Le=V&32767,Be=N[Kt];if(j[Le]=Be,N[Kt]=Le,xe<=V){var ke=s-V;if((we>7e3||De>24576)&&(ke>423||!c)){u=$l(t,p,0,ae,ue,Ee,X,De,He,V-He,u),De=we=X=0,He=V;for(var he=0;he<286;++he)ue[he]=0;for(var he=0;he<30;++he)Ee[he]=0}var $e=2,Ie=0,_n=A,Xe=Le-Be&32767;if(ke>2&&Kt==B(V-Xe))for(var Tt=Math.min(y,ke)-1,Re=Math.min(32767,V),Ae=Math.min(258,ke);Xe<=Re&&--_n&&Le!=Be;){if(t[V+$e]==t[V+$e-Xe]){for(var ie=0;ie<Ae&&t[V+ie]==t[V+ie-Xe];++ie);if(ie>$e){if($e=ie,Ie=Xe,ie>Tt)break;for(var Pe=Math.min(Xe,ie-2),Ge=0,he=0;he<Pe;++he){var St=V-Xe+he&32767,An=j[St],or=St-An&32767;or>Ge&&(Ge=or,Be=St)}}}Le=Be,Be=j[Le],Xe+=Le-Be&32767}if(Ie){ae[De++]=268435456|Xi[$e]<<18|zl[Ie];var Mn=Xi[$e]&31,cn=zl[Ie]&31;X+=oi[Mn]+ii[cn],++ue[257+Mn],++Ee[cn],xe=V+$e,++we}else ae[De++]=t[V],++ue[t[V]]}}for(V=Math.max(V,xe);V<s;++V)ae[De++]=t[V],++ue[t[V]];u=$l(t,p,c,ae,ue,Ee,X,De,He,V-He,u),c||(o.r=u&7|p[u/8|0]<<3,u-=7,o.h=N,o.p=j,o.i=V,o.w=xe)}else{for(var V=o.w||0;V<s+c;V+=65535){var un=V+65535;un>=s&&(p[u/8|0]=c,un=s),u=Wl(p,u+1,t.subarray(V,un))}o.i=s}return lo(a,0,r+oa(u)+i)},Hp=(function(){for(var t=new Int32Array(256),e=0;e<256;++e){for(var n=e,r=9;--r;)n=(n&1&&-306674912)^n>>>1;t[e]=n}return t})(),$p=function(){var t=-1;return{p:function(e){for(var n=t,r=0;r<e.length;++r)n=Hp[n&255^e[r]]^n>>>8;t=n},d:function(){return~t}}};var Fp=function(t,e,n,r,i){if(!i&&(i={l:1},e.dictionary)){var o=e.dictionary.subarray(-32768),s=new Te(o.length+t.length);s.set(o),s.set(t,o.length),t=s,i.w=o.length}return zp(t,e.level==null?6:e.level,e.mem==null?i.l?Math.ceil(Math.max(8,Math.min(13,Math.log(t.length)))*1.5):20:12+e.mem,n,r,i)},Kl=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n};var Zt=function(t,e){return t[e]|t[e+1]<<8},Pt=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},Ki=function(t,e){return Pt(t,e)+Pt(t,e+4)*4294967296},Ue=function(t,e,n){for(;n;++e)t[e]=n,n>>>=8};function jp(t,e){return Fp(t,e||{},0,0)}function Vp(t,e){return Op(t,{i:2},e&&e.out,e&&e.dictionary)}var Jl=function(t,e,n,r){for(var i in t){var o=t[i],s=e+i,a=r;Array.isArray(o)&&(a=Kl(r,o[1]),o=o[0]),o instanceof Te?n[s]=[o,a]:(n[s+="/"]=[new Te(0),a],Jl(o,s,n,r))}},Fl=typeof TextEncoder<"u"&&new TextEncoder,ta=typeof TextDecoder<"u"&&new TextDecoder,Up=0;try{ta.decode(Yl,{stream:!0}),Up=1}catch{}var Gp=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:lo(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function jl(t,e){if(e){for(var n=new Te(t.length),r=0;r<t.length;++r)n[r]=t.charCodeAt(r);return n}if(Fl)return Fl.encode(t);for(var i=t.length,o=new Te(t.length+(t.length>>1)),s=0,a=function(u){o[s++]=u},r=0;r<i;++r){if(s+5>o.length){var p=new Te(s+8+(i-r<<1));p.set(o),o=p}var c=t.charCodeAt(r);c<128||e?a(c):c<2048?(a(192|c>>6),a(128|c&63)):c>55295&&c<57344?(c=65536+(c&1047552)|t.charCodeAt(++r)&1023,a(240|c>>18),a(128|c>>12&63),a(128|c>>6&63),a(128|c&63)):(a(224|c>>12),a(128|c>>6&63),a(128|c&63))}return lo(o,0,s)}function qp(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(ta)return ta.decode(t);var i=Gp(t),o=i.s,n=i.r;return n.length&&rt(8),o}}var Zp=function(t,e){return e+30+Zt(t,e+26)+Zt(t,e+28)},Wp=function(t,e,n){var r=Zt(t,e+28),i=qp(t.subarray(e+46,e+46+r),!(Zt(t,e+8)&2048)),o=e+46+r,s=Pt(t,e+20),a=n&&s==4294967295?Yp(t,o):[s,Pt(t,e+24),Pt(t,e+42)],p=a[0],c=a[1],u=a[2];return[Zt(t,e+10),p,c,i,o+Zt(t,e+30)+Zt(t,e+32),u]},Yp=function(t,e){for(;Zt(t,e)!=1;e+=4+Zt(t,e+2));return[Ki(t,e+12),Ki(t,e+4),Ki(t,e+20)]},na=function(t){var e=0;if(t)for(var n in t){var r=t[n].length;r>65535&&rt(9),e+=r+4}return e},Vl=function(t,e,n,r,i,o,s,a){var p=r.length,c=n.extra,u=a&&a.length,g=na(c);Ue(t,e,s!=null?33639248:67324752),e+=4,s!=null&&(t[e++]=20,t[e++]=n.os),t[e]=20,e+=2,t[e++]=n.flag<<1|(o<0&&8),t[e++]=i&&8,t[e++]=n.compression&255,t[e++]=n.compression>>8;var y=new Date(n.mtime==null?Date.now():n.mtime),A=y.getFullYear()-1980;if((A<0||A>119)&&rt(10),Ue(t,e,A<<25|y.getMonth()+1<<21|y.getDate()<<16|y.getHours()<<11|y.getMinutes()<<5|y.getSeconds()>>1),e+=4,o!=-1&&(Ue(t,e,n.crc),Ue(t,e+4,o<0?-o-2:o),Ue(t,e+8,n.size)),Ue(t,e+12,p),Ue(t,e+14,g),e+=16,s!=null&&(Ue(t,e,u),Ue(t,e+6,n.attrs),Ue(t,e+10,s),e+=14),t.set(r,e),e+=p,g)for(var R in c){var j=c[R],N=j.length;Ue(t,e,+R),Ue(t,e+2,N),t.set(j,e+4),e+=4+N}return u&&(t.set(a,e),e+=u),e},Kp=function(t,e,n,r,i){Ue(t,e,101010256),Ue(t,e+8,n),Ue(t,e+10,n),Ue(t,e+12,r),Ue(t,e+16,i)};function Xl(t,e){e||(e={});var n={},r=[];Jl(t,"",n,e);var i=0,o=0;for(var s in n){var a=n[s],p=a[0],c=a[1],u=c.level==0?0:8,g=jl(s),y=g.length,A=c.comment,R=A&&jl(A),j=R&&R.length,N=na(c.extra);y>65535&&rt(11);var J=u?jp(p,c):p,C=J.length,B=$p();B.p(p),r.push(Kl(c,{size:p.length,crc:B.d(),c:J,f:g,m:R,u:y!=s.length||R&&A.length!=j,o:i,compression:u})),i+=30+y+N+C,o+=76+2*(y+N)+(j||0)+C}for(var ae=new Te(o+22),ue=i,Ee=o-i,we=0;we<r.length;++we){var g=r[we];Vl(ae,g.o,g,g.f,g.u,g.c.length);var X=30+g.f.length+na(g.extra);ae.set(g.c,g.o+X),Vl(ae,i,g,g.f,g.u,g.c.length,g.o,g.m),i+=16+X+(g.m?g.m.length:0)}return Kp(ae,i,r.length,Ee,ue),ae}function Ql(t,e){for(var n={},r=t.length-22;Pt(t,r)!=101010256;--r)(!r||t.length-r>65558)&&rt(13);var i=Zt(t,r+8);if(!i)return{};var o=Pt(t,r+16),s=o==4294967295||i==65535;if(s){var a=Pt(t,r-12);s=Pt(t,a)==101075792,s&&(i=Pt(t,a+32),o=Pt(t,a+48))}for(var p=e&&e.filter,c=0;c<i;++c){var u=Wp(t,o,s),g=u[0],y=u[1],A=u[2],R=u[3],j=u[4],N=u[5],J=Zp(t,N);o=j,(!p||p({name:R,size:y,originalSize:A,compression:g}))&&(g?g==8?n[R]=Vp(t.subarray(J,J+y),{out:new Te(A)}):rt(14,"unknown compression type "+g):n[R]=lo(t,J,J+y))}return n}function Ot(){return qt()}var kt={get isSignedIn(){return qt().isSignedIn},get accessToken(){return qt().accessToken},get userName(){return qt().userName},get email(){return qt().email},set isSignedIn(t){let e=qt();Bt({...e,isSignedIn:t})},set accessToken(t){let e=qt();Bt({...e,accessToken:t})},set userName(t){let e=qt();Bt({...e,userName:t})},set email(t){let e=qt();Bt({...e,email:t})}};function mo(){return ze().auth.autoBackupEnabled}function Yt(){return ze().auth.autoBackupIntervalMinutes}var sa=null,ve=null,pe=null,rr=null;function nc(t){sa=t}function rc(t){ve=t}function oc(t){pe=t}function ic(t){rr=t}var ec=!1;function ac(){if(!ec)try{let t=document.createElement("style");t.textContent=`
@keyframes tk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes tk-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
.tk-auth-spinner { display:inline-block; width:12px; height:12px; border:2px solid rgba(255,165,0,0.3); border-top-color:#ffa500; border-radius:50%; margin-right:6px; vertical-align:-2px; animation: tk-spin 0.9s linear infinite; }
.tk-auth-blink { animation: tk-blink 0.4s ease-in-out 3; }
`,document.head.appendChild(t),ec=!0}catch{}}var sc=null,la=null,co=null,uo=null,ca=null;function lc(t){sc=t}function cc(t){la=t}function ua(t){co=t}function da(t){uo=t}function uc(t){ca=t}var si="1023528652072-45cu3dr7o5j79vsdn8643bhle9ee8kds.apps.googleusercontent.com",dc="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile",pc="https://www.youtube.com/",Jp=new Date(Date.UTC(2e3,0,1,0,0,0)),Xp=30*1e3,Qp=1800*1e3,tc=5,ai=null,ot=null;async function pa(){try{let t=await uo("googleAuthState"),e=t&&typeof t=="object"?{...t,accessToken:t.accessToken?"[REDACTED]":null}:t;d("Loading Google auth state from IndexedDB:",e);let n=Bi.safeParse(t);if(n.success){let r=Ot();Bt({...r,...n.data});let i=Ot();i.isSignedIn&&i.accessToken&&d(`Reusing stored Google auth token for ${i.userName||i.email||"user"}`),Pr();let o=Ot();o.isSignedIn&&o.accessToken&&await En(!0)}else if(t!==void 0){let r=t&&typeof t=="object"?{...t,accessToken:t.accessToken?"[REDACTED]":null}:t;d("Google auth state failed validation:",{stored:r,errors:n.error.format()},"warn")}}catch(t){d("Failed to load Google auth state:",t,"error")}}async function fo(){try{let t=Ot(),e=Bi.safeParse(t);if(!e.success){let n={...t,accessToken:t.accessToken?"[REDACTED]":null};d("Invalid auth state, cannot save",{state:n,errors:e.error.format()},"error");return}await co("googleAuthState",t),t.isSignedIn&&t.accessToken?d(`Saved Google auth state to IndexedDB for ${t.userName||t.email||"user"}`):d("Cleared Google auth state in IndexedDB (signed out)")}catch(t){d("Failed to save Google auth state:",t,"error")}}function Pr(){sa&&(sa.style.display="none")}function pt(t,e){if(!pe)return;if(pe.style.fontWeight="bold",t==="authenticating"){ac(),pe.style.color="#ffa500",pe.replaceChildren();let r=document.createElement("span");r.className="tk-auth-spinner";let i=document.createTextNode(` ${e||"Authorizing with Google\u2026"}`);pe.appendChild(r),pe.appendChild(i);return}if(t==="error"){ge(pe,"circle-x",e||"Authorization failed"),pe.style.color="#ff4d4f",Me();return}let n=Ot();n.isSignedIn?(ge(pe,"circle-check","Signed in"),pe.style.color="#52c41a",pe.removeAttribute("title"),n.userName?(pe.onmouseenter=()=>{ge(pe,"circle-check",`Signed in as ${n.userName}`)},pe.onmouseleave=()=>{ge(pe,"circle-check","Signed in")}):(pe.onmouseenter=null,pe.onmouseleave=null)):(ge(pe,"circle-x","Not signed in"),pe.style.color="#ff4d4f",pe.removeAttribute("title"),pe.onmouseenter=null,pe.onmouseleave=null),Me()}function em(){pe&&(ac(),pe.classList.remove("tk-auth-blink"),pe.offsetWidth,pe.classList.add("tk-auth-blink"),setTimeout(()=>{pe.classList.remove("tk-auth-blink")},1200))}function mc(t,e=300*1e3){return new Promise((n,r)=>{if(!t){d&&d("OAuth monitor: popup is null",null,"error"),r(new Error("Failed to open popup"));return}d&&d("OAuth monitor: starting to monitor popup for token");let i=Date.now(),o="timekeeper_oauth",s=null,a=null,p=null,c=()=>{if(s){try{s.close()}catch{}s=null}a&&(clearInterval(a),a=null),p&&(clearInterval(p),p=null)};try{s=new BroadcastChannel(o),d&&d("OAuth monitor: BroadcastChannel created successfully"),s.onmessage=y=>{let A=y.data?.token?{...y.data,token:"[REDACTED]"}:y.data;d&&d("OAuth monitor: received BroadcastChannel message",A);let R=U.object({type:U.string(),token:U.string().optional(),error:U.string().optional()}).safeParse(y.data);if(!R.success){d&&d("OAuth monitor: invalid message format",R.error,"warn");return}if(R.data.type==="timekeeper_oauth_token"&&R.data.token){d&&d("OAuth monitor: token received via BroadcastChannel"),c();try{t.close()}catch{}n(R.data.token)}else if(R.data.type==="timekeeper_oauth_error"){d&&d("OAuth monitor: error received via BroadcastChannel",R.data.error,"error"),c();try{t.close()}catch{}r(new Error(R.data.error||"OAuth failed"))}}}catch(y){d&&d("OAuth monitor: BroadcastChannel not supported, using IndexedDB fallback",y)}d&&d("OAuth monitor: setting up IndexedDB polling");let u=Date.now();a=setInterval(async()=>{try{let y=indexedDB.open("ytls-timestamps-db",4);y.onsuccess=()=>{let A=y.result,N=A.transaction("settings","readonly").objectStore("settings").get("oauth_message");N.onsuccess=()=>{let J=N.result;if(J&&J.value){let C=J.value,B=U.object({type:U.string(),token:U.string().optional(),error:U.string().optional(),timestamp:U.number().optional()}).safeParse(C);if(!B.success){d&&d("OAuth monitor: invalid IndexedDB message format",B.error,"warn");return}if(B.data.timestamp&&B.data.timestamp>u){let ae=B.data.token?{...B.data,token:"[REDACTED]"}:B.data;if(d&&d("OAuth monitor: received IndexedDB message",ae),B.data.type==="timekeeper_oauth_token"&&B.data.token){d&&d("OAuth monitor: token received via IndexedDB"),c();try{t.close()}catch{}A.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),n(B.data.token)}else if(B.data.type==="timekeeper_oauth_error"){d&&d("OAuth monitor: error received via IndexedDB",B.data.error,"error"),c();try{t.close()}catch{}A.transaction("settings","readwrite").objectStore("settings").delete("oauth_message"),r(new Error(B.data.error||"OAuth failed"))}u=B.data.timestamp||Date.now()}}A.close()}}}catch(y){d&&d("OAuth monitor: IndexedDB polling error",y,"error")}},500),p=setInterval(()=>{if(Date.now()-i>e){d&&d("OAuth monitor: popup timed out after 5 minutes",null,"error"),c();try{t.close()}catch{}r(new Error("OAuth popup timed out"));return}},1e3)})}async function fc(){if(!si){pt("error","Google Client ID not configured");return}try{d&&d("OAuth signin: starting OAuth flow"),pt("authenticating","Opening authentication window...");let t=new URL("https://accounts.google.com/o/oauth2/v2/auth");t.searchParams.set("client_id",si),t.searchParams.set("redirect_uri",pc),t.searchParams.set("response_type","token"),t.searchParams.set("scope",dc),t.searchParams.set("include_granted_scopes","true"),t.searchParams.set("state","timekeeper_auth"),d&&d("OAuth signin: opening popup");let e=window.open(t.toString(),"TimekeeperGoogleAuth","width=500,height=600,menubar=no,toolbar=no,location=no");if(!e){d&&d("OAuth signin: popup blocked by browser",null,"error"),pt("error","Popup blocked. Please enable popups for YouTube.");return}d&&d("OAuth signin: popup opened successfully"),pt("authenticating","Waiting for authentication...");try{let n=await mc(e),r=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${n}`}});if(r.ok){let i=await r.json(),o=U.object({name:U.string().optional(),email:U.string().optional()}).safeParse(i);if(!o.success)throw d&&d("Failed to validate user info response",o.error,"error"),new Error("Invalid user info response");let s=o.data;Bt({isSignedIn:!0,accessToken:n,userName:s.name||null,email:s.email||null}),await fo(),Pr(),pt(),Me(),await En(),d?d(`Successfully authenticated as ${s.name}`):console.log(`[Timekeeper] Successfully authenticated as ${s.name}`)}else throw new Error("Failed to fetch user info")}catch(n){let r=n instanceof Error?n.message:"Authentication failed";d?d("OAuth failed:",n,"error"):console.error("[Timekeeper] OAuth failed:",n),pt("error",r);return}}catch(t){let e=t instanceof Error?t.message:"Sign in failed";d?d("Failed to sign in to Google:",t,"error"):console.error("[Timekeeper] Failed to sign in to Google:",t),pt("error",`Failed to sign in: ${e}`)}}async function tm(){let t=Ot(),e=t.email;if(!si||!e)return!1;d("Silent OAuth: attempting silent token refresh for "+e);let n=new URL("https://accounts.google.com/o/oauth2/v2/auth");n.searchParams.set("client_id",si),n.searchParams.set("redirect_uri",pc),n.searchParams.set("response_type","token"),n.searchParams.set("scope",dc),n.searchParams.set("include_granted_scopes","true"),n.searchParams.set("state","timekeeper_auth"),n.searchParams.set("prompt","none"),n.searchParams.set("login_hint",e);let r=window.open(n.toString(),"TimekeeperGoogleAuthSilent","width=1,height=1,left=-2000,top=-2000,menubar=no,toolbar=no,location=no");if(!r)return d("Silent OAuth: popup blocked",null,"warn"),!1;try{let i=await mc(r,15e3);return Bt({...t,isSignedIn:!0,accessToken:i}),await fo(),Pr(),pt(),d("Silent OAuth: token refreshed successfully for "+e),!0}catch(i){d("Silent OAuth: silent refresh failed",i,"warn");try{r.close()}catch{}return!1}}async function hc(){if(!window.opener||window.opener===window)return!1;d&&d("OAuth popup: detected popup window, checking for OAuth response");let t=window.location.hash;if(!t||t.length<=1)return d&&d("OAuth popup: no hash params found"),!1;let e=t.startsWith("#")?t.substring(1):t,n=new URLSearchParams(e),r=n.get("state");if(d&&d("OAuth popup: hash params found, state="+r),r!=="timekeeper_auth")return d&&d("OAuth popup: not our OAuth flow (wrong state)"),!1;let i=n.get("error"),o=n.get("access_token"),s="timekeeper_oauth";if(i){try{let a=new BroadcastChannel(s);a.postMessage({type:"timekeeper_oauth_error",error:n.get("error_description")||i}),a.close(),d&&d("OAuth popup: error broadcast via BroadcastChannel")}catch{let p={type:"timekeeper_oauth_error",error:n.get("error_description")||i,timestamp:Date.now()};d&&d("OAuth popup: writing error to IndexedDB",p);let c=indexedDB.open("ytls-timestamps-db",4);c.onsuccess=()=>{let u=c.result,y=u.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:p});y.onsuccess=()=>{d&&d("OAuth popup: error written to IndexedDB successfully")},y.onerror=()=>{d&&d("OAuth popup: failed to write error to IndexedDB",y.error,"error")},u.close()},c.onerror=()=>{d&&d("OAuth popup: failed to open IndexedDB",c.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}if(o){d&&d("OAuth popup: access token found, broadcasting to opener");try{let a=new BroadcastChannel(s);a.postMessage({type:"timekeeper_oauth_token",token:o}),a.close(),d&&d("OAuth popup: token broadcast via BroadcastChannel")}catch(a){d&&d("OAuth popup: BroadcastChannel failed, using IndexedDB",a);let p={type:"timekeeper_oauth_token",token:o,timestamp:Date.now()},c={...p,token:"[REDACTED]"};d&&d("OAuth popup: writing token to IndexedDB",c);let u=indexedDB.open("ytls-timestamps-db",4);u.onsuccess=()=>{let g=u.result,A=g.transaction("settings","readwrite").objectStore("settings").put({key:"oauth_message",value:p});A.onsuccess=()=>{d&&d("OAuth popup: token written to IndexedDB successfully")},A.onerror=()=>{d&&d("OAuth popup: failed to write token to IndexedDB",A.error,"error")},g.close()},u.onerror=()=>{d&&d("OAuth popup: failed to open IndexedDB",u.error,"error")}}return setTimeout(()=>{try{window.close()}catch{}},500),!0}return!1}async function gc(){Bt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await fo(),await En(),Pr(),pt(),Me()}async function vc(){let t=Ot();if(!t.isSignedIn||!t.accessToken)return!1;try{let e=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${t.accessToken}`}});return e.status===401?(await wc({silent:!0}),!1):e.ok}catch(e){return d("Failed to verify auth state:",e,"error"),!1}}function li(){let t=Ot();return t.isSignedIn&&!!t.accessToken}function Rr(){return li()}function nm(){let t=[];return li()&&t.push("Google Drive"),t}function rm(t){let e=Ql(new Uint8Array(t)),n=Object.values(e)[0];return n?new TextDecoder().decode(n):null}async function yc(t){let e={Authorization:`Bearer ${t}`},r=`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)&pageSize=10`,i=await fetch(r,{headers:e});if(i.status===401)throw new Error("unauthorized");if(!i.ok)throw new Error("drive search failed");let o=await i.json();if(Array.isArray(o.files)&&o.files.length>0)return o.files[0].id;let s=await fetch("https://www.googleapis.com/drive/v3/files",{method:"POST",headers:{...e,"Content-Type":"application/json"},body:JSON.stringify({name:"Timekeeper",mimeType:"application/vnd.google-apps.folder"})});if(s.status===401)throw new Error("unauthorized");if(!s.ok)throw new Error("drive folder create failed");return(await s.json()).id}async function bc(t,e,n){let r=`name='${t}' and '${e}' in parents and trashed=false`,i=encodeURIComponent(r),o=await fetch(`https://www.googleapis.com/drive/v3/files?q=${i}&fields=files(id,name)`,{method:"GET",headers:{Authorization:`Bearer ${n}`}});if(o.status===401)throw new Error("unauthorized");if(!o.ok)return null;let s=await o.json();return s.files&&s.files.length>0?s.files[0].id:null}async function om(t){try{let e=await yc(t),n=await bc("timekeeper-data.zip",e,t);if(!n)return null;let r=await fetch(`https://www.googleapis.com/drive/v3/files/${n}?alt=media`,{headers:{Authorization:`Bearer ${t}`}});if(r.status===401)throw new Error("unauthorized");return r.ok?rm(await r.arrayBuffer()):null}catch(e){if(e.message==="unauthorized")throw e;return d("Failed to fetch latest Drive backup for merge:",e,"warn"),null}}async function im(){if(!la)return;let t=Ot();if(!t.isSignedIn||!t.accessToken)return;let e=await om(t.accessToken).catch(async i=>i.message==="unauthorized"?(await wc({silent:!0}),null):(d("Failed to fetch latest Drive backup for merge:",i,"warn"),null)),n=e?[e]:[],r=0;for(let i of n)if(i)try{let{mergedVideos:o,mergedTimestamps:s}=await la(i);s>0&&(d(`Pre-backup merge: added ${s} timestamps from ${o} videos from remote`),r+=s)}catch(o){d("Failed to merge remote backup data:",o,"warn")}r>0&&ca&&ca()}function am(t,e){let n=new TextEncoder().encode(t),r=e.replace(/\\/g,"/").replace(/^\/+/,"");return r.endsWith(".json")||(r+=".json"),Xl({[r]:[n,{level:6,mtime:Jp,os:0}]})}async function sm(t,e,n,r){let i=t.replace(/\.json$/,".zip"),o=await bc(i,n,r),s=new TextEncoder().encode(e).length,a=am(e,t),p=a.length;d(`Compressing data: ${s} bytes -> ${p} bytes (${Math.round(100-p/s*100)}% reduction)`);let c="-------314159265358979",u=`\r
--${c}\r
`,g=`\r
--${c}--`,y=o?{name:i,mimeType:"application/zip"}:{name:i,mimeType:"application/zip",parents:[n]},A=8192,R="";for(let ae=0;ae<a.length;ae+=A){let ue=a.subarray(ae,Math.min(ae+A,a.length));R+=String.fromCharCode.apply(null,Array.from(ue))}let j=btoa(R),N=u+`Content-Type: application/json; charset=UTF-8\r
\r
`+JSON.stringify(y)+u+`Content-Type: application/zip\r
Content-Transfer-Encoding: base64\r
\r
`+j+g,J,C;o?(J=`https://www.googleapis.com/upload/drive/v3/files/${o}?uploadType=multipart&fields=id,name`,C="PATCH"):(J="https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",C="POST");let B=await fetch(J,{method:C,headers:{Authorization:`Bearer ${r}`,"Content-Type":`multipart/related; boundary=${c}`},body:N});if(B.status===401)throw new Error("unauthorized");if(!B.ok)throw new Error("drive upload failed")}async function wc(t){d("Auth expired, attempting silent token refresh",null,"warn"),!await tm()&&(d("Silent OAuth: falling back to sign-out",null,"warn"),Bt({isSignedIn:!1,accessToken:null,userName:null,email:null}),await fo(),await En(),pt("error","Authorization expired. Please sign in again."),Me())}async function lm(t){if(!li())throw t?.silent||pt("error","Configure a backup destination first"),new Error("no-backup-destination");await im();let e=await sc({includeDeleted:!0});if(e.totalTimestamps===0){t?.silent||d("Skipping export: no timestamps to back up");return}let n=Ot();if(!n.accessToken)throw new Error("unauthorized");let r=await yc(n.accessToken);await sm(e.filename,e.json,r,n.accessToken),d(`Exported backup to Google Drive (${e.filename}) with ${e.totalVideos} videos / ${e.totalTimestamps} timestamps.`)}async function xc(){try{let[t,e,n]=await Promise.all([uo("lastAutoBackupAt"),uo("autoBackupEnabled"),uo("autoBackupIntervalMinutes")]),r=Ri.partial().safeParse({autoBackupEnabled:e,autoBackupIntervalMinutes:n,lastAutoBackupAt:typeof t=="number"&&t>0?t:null});r.success?(typeof r.data.autoBackupEnabled=="boolean"&&Fi(r.data.autoBackupEnabled),typeof r.data.autoBackupIntervalMinutes=="number"&&ji(r.data.autoBackupIntervalMinutes),typeof r.data.lastAutoBackupAt=="number"&&Ui(r.data.lastAutoBackupAt)):d("Failed to validate auto backup settings:",r.error.format(),"warn")}catch(t){d("Failed to load auto backup settings:",t,"error")}}async function ma(){try{let t=ze().auth,e={autoBackupEnabled:t.autoBackupEnabled,autoBackupIntervalMinutes:t.autoBackupIntervalMinutes,lastAutoBackupAt:t.lastAutoBackupAt},n=Ri.safeParse(e);if(!n.success){d("Invalid auto backup settings, cannot save",{settings:e,errors:n.error.format()},"error");return}await Promise.all([co("autoBackupEnabled",t.autoBackupEnabled),co("autoBackupIntervalMinutes",t.autoBackupIntervalMinutes),co("lastAutoBackupAt",t.lastAutoBackupAt)])}catch(t){d("Failed to save auto backup settings:",t,"error")}}function cm(){ai&&(clearInterval(ai),ai=null),ot&&(clearTimeout(ot),ot=null)}function nr(t){try{let e=new Date(t),n=new Date,r=e.toDateString()===n.toDateString(),i=e.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return r?i:`${e.toLocaleDateString()} ${i}`}catch{return""}}function ia(){let t=nm();return t.length>0?`Destinations: ${t.join(", ")}`:"No backup destination configured"}function kc(){let t=ze().auth;return t.autoBackupEnabled?t.isAutoBackupRunning?"#4285f4":t.autoBackupBackoffMs&&t.autoBackupBackoffMs>0?"#ffa500":Rr()&&t.lastAutoBackupAt?"#52c41a":Rr()?"#ffa500":"#ff4d4f":"#ff4d4f"}function Me(){if(fa(),!ve)return;let t=ze().auth;if(!t.autoBackupEnabled)ge(ve,"refresh","Backup: Off"),ve.onmouseenter=null,ve.onmouseleave=null;else if(t.isAutoBackupRunning)ge(ve,"refresh","Backing up\u2026"),ve.onmouseenter=null,ve.onmouseleave=null;else if(t.autoBackupBackoffMs&&t.autoBackupBackoffMs>0){let n=Math.ceil(t.autoBackupBackoffMs/6e4);ge(ve,"alert-triangle",`Retry in ${n}m`),ve.onmouseenter=null,ve.onmouseleave=null}else if(!Rr())ge(ve,"alert-triangle","Backup target missing"),ve.onmouseenter=null,ve.onmouseleave=null;else if(t.lastAutoBackupAt){let n=t.lastAutoBackupAt,r=n+Math.max(1,Yt())*60*1e3,i=nr(r);ve.onmouseenter=()=>{ge(ve,"database",`Next backup: ${i}`)},ve.onmouseleave=()=>{ge(ve,"database",`Last backup: ${nr(n)}`)},ge(ve,"database",`Last backup: ${nr(n)}`)}else{let n=Date.now()+Math.max(1,Yt())*60*1e3,r=nr(n);ve.onmouseenter=()=>{ge(ve,"database",`Next backup: ${r}`)},ve.onmouseleave=()=>{ge(ve,"database","Last backup: never")},ge(ve,"database","Last backup: never")}ve.style.display="inline";let e=kc();ve.style.color=e}var aa="ytls-backup-indicator--pulsing",um="#4285f4",Br=null;function dm(t,e){Br&&(t.removeEventListener("animationiteration",Br),Br=null),e===um?(t.style.backgroundColor=e,t.classList.add(aa)):t.classList.contains(aa)?(Br=()=>{rr&&(rr.classList.remove(aa),rr.style.backgroundColor=e,Br=null)},t.addEventListener("animationiteration",Br,{once:!0})):t.style.backgroundColor=e}function fa(){if(!rr)return;let t=kc();dm(rr,t),dt(rr,()=>{let e=ze().auth,n="";if(!e.autoBackupEnabled)n="Auto backup is disabled";else if(e.isAutoBackupRunning)n="Backup in progress";else if(e.autoBackupBackoffMs&&e.autoBackupBackoffMs>0)n=`Retrying backup in ${Math.ceil(e.autoBackupBackoffMs/6e4)}m`;else if(!Rr())n=ia();else if(e.lastAutoBackupAt){let r=e.lastAutoBackupAt+Math.max(1,Yt())*60*1e3,i=nr(r);n=`Last backup: ${nr(e.lastAutoBackupAt)}
Next backup: ${i}
${ia()}`}else{let r=Date.now()+Math.max(1,Yt())*60*1e3;n=`No backup yet
Next backup: ${nr(r)}
${ia()}`}return n})}async function po(t={}){let{silent:e=!0,skipBackoff:n=!1}=t;if(!Rr()){e||(Me(),li()||em());return}if(ot){if(!n){d("Auto backup: backoff in progress, skipping scheduled run");return}clearTimeout(ot),ot=null,Dr(null),d("Auto backup: manual run cleared backoff and will proceed immediately")}if(!ze().auth.isAutoBackupRunning){Vi(!0),Me();try{await lm({silent:e}),Ui(Date.now()),ri(0),Dr(null),ot&&(clearTimeout(ot),ot=null),await ma()}catch(r){if(d("Auto backup failed:",r,"error"),r.message==="unauthorized"){d("Auth error detected, clearing token and stopping retries",null,"warn");let o=Ot();Bt({...o,accessToken:null,isSignedIn:!1}),await fo(),pt("error","Authorization expired. Please sign in again."),Me(),ri(0),Dr(null),ot&&(clearTimeout(ot),ot=null)}else if(ze().auth.autoBackupRetryAttempts<tc){let o=ze().auth.autoBackupRetryAttempts+1;ri(o);let a=Math.min(Xp*Math.pow(2,o-1),Qp);Dr(a),ot&&clearTimeout(ot),ot=setTimeout(()=>{po({silent:!0})},a),d(`Scheduling backup retry ${o}/${tc} in ${Math.round(a/1e3)}s`),Me()}else Dr(null)}finally{Vi(!1),Me()}}}async function En(t=!1){if(cm(),!!mo()&&Rr()){if(ai=setInterval(()=>{po({silent:!0})},Math.max(1,Yt())*60*1e3),!t){let e=Date.now(),n=Math.max(1,Yt())*60*1e3,r=ze().auth.lastAutoBackupAt;(!r||e-r>=n)&&po({silent:!0})}Me()}}async function Tc(){let t=mo();Fi(!t),await ma(),await En(),Me()}async function Sc(){let t=Yt(),e=prompt("Set Auto Backup interval (minutes):",String(t));if(e===null)return;let n=Math.floor(Number(e));if(!Number.isFinite(n)||n<5||n>1440){alert("Please enter a number between 5 and 1440 minutes.");return}ji(n),await ma(),await En(),Me()}function ha(t,e){return Qo(t).then(n=>n!==void 0?n:e)}function ga(t,e){return Xo(t,e),Promise.resolve()}var va=window.location.hash;if(va&&va.length>1){let t=new URLSearchParams(va.substring(1));if(t.get("state")==="timekeeper_auth"){let n=t.get("access_token");if(n){console.log("[Timekeeper] Auth token detected in URL, broadcasting token"),console.log("[Timekeeper] Token length:",n.length,"characters");try{let r=new BroadcastChannel("timekeeper_oauth"),i={type:"timekeeper_oauth_token",token:n};console.log("[Timekeeper] Sending auth message via BroadcastChannel:",{type:i.type,tokenLength:n.length}),r.postMessage(i),r.close(),console.log("[Timekeeper] Token broadcast via BroadcastChannel completed")}catch(r){console.log("[Timekeeper] BroadcastChannel failed, using IndexedDB fallback:",r);let i={type:"timekeeper_oauth_token",token:n,timestamp:Date.now()},o=indexedDB.open("ytls-timestamps-db",4);o.onsuccess=()=>{let s=o.result,a=s.transaction("settings","readwrite");a.objectStore("settings").put({key:"oauth_message",value:i}),a.oncomplete=()=>{console.log("[Timekeeper] Token broadcast via IndexedDB completed, timestamp:",i.timestamp),s.close()}}}if(history.replaceState){let r=window.location.pathname+window.location.search;history.replaceState(null,"",r)}throw console.log("[Timekeeper] Closing window after broadcasting auth token"),window.close(),new Error("OAuth window closed")}}}Nl();(async function(){"use strict";if(window.top!==window.self)return;function t(l){return ha(l,void 0)}function e(l,m){return ga(l,m)}da(t),ua(e);try{let l=await Qo("device_id"),m=typeof l=="string"&&l.length>0?l:crypto.randomUUID();await Xo("device_id",m),d(`Lamport: device_id = ${m}`)}catch(l){d("Lamport: failed to initialize device_id:",l,"warn")}if(await hc()){d("OAuth popup detected, broadcasting token and closing");return}await pa();let r=["/watch","/live"];function i(l=window.location.href){try{let m=new URL(l);return m.origin!=="https://www.youtube.com"?!1:r.some(h=>m.pathname===h||m.pathname.startsWith(`${h}/`))}catch(m){return d("Timekeeper failed to parse URL for support check:",m,"error"),!1}}let o=null,s=null,a=null,p=null,c=null,u=null,g=(()=>{try{let l=parseFloat(localStorage.getItem("ytls-last-speed")??"");return Number.isFinite(l)&&l>0&&l!==1?Math.min(l,4):2}catch{return 2}})(),y=!1,A=null,R=null,j=250,N=null,J=!1;function C(){return ze().ui.minPaneHeight}function B(l){Tl(l)}function ae(){return ze().ui.lastHandledUrl}function ue(l){El(l)}function Ee(){return ze().ui.urlChangeHandlersSetup}function we(l){_l(l)}function X(){return ze().ui.panePosition}function V(l){Sl(l)}function De(){return ze().timestamps.items}function xe(l){Al(l)}function He(){return ze().timestamps.currentIndex}function Kt(l){Ml(l)}function Le(){return o?o.getBoundingClientRect():null}function Be(l,m,h){l&&V({x:Math.round(typeof m=="number"?m:l.left),y:Math.round(typeof h=="number"?h:l.top),width:Math.round(l.width),height:Math.round(l.height)})}function ke(l=!0){if(!o)return;cr();let m=Le();if(m&&(m.width||m.height)&&(Be(m),l)){let h=X();Do("windowPosition",h),Nr({type:"window_position_updated",position:h,timestamp:Date.now()})}}function he(){if(!o||!s||!p||!a)return;let l=40,m=be();if(m.length>0)l=m[0].offsetHeight;else{let h=document.createElement("li");h.style.visibility="hidden",h.style.position="absolute",h.textContent="00:00 Example",a.appendChild(h),l=h.offsetHeight,a.removeChild(h)}j=s.offsetHeight+p.offsetHeight+l,B(j),o.style.minHeight=C()+"px"}function $e(){requestAnimationFrame(()=>{Fe?.(),he(),ke(!0)})}function Ie(l=450){Ce&&(clearTimeout(Ce),Ce=null),Ce=setTimeout(()=>{Re(),$e(),Ce=null},l)}function _n(){Ce&&(clearTimeout(Ce),Ce=null)}function Xe(){a&&(a.style.visibility="hidden",d("Hiding timestamps during show animation")),$e(),Ie()}function Tt(){Re(),_n(),Et&&(clearTimeout(Et),Et=null),Et=setTimeout(()=>{o&&(o.style.display="none",$a(),Et=null)},400)}function Re(){if(!a){mt&&(mt(),mt=null,Jt=null,Cn=null);return}if(!Cn){a.style.visibility==="hidden"&&(a.style.visibility="",d("Restoring timestamp visibility (no deferred fragment)")),mt&&(mt(),mt=null,Jt=null);return}d("Appending deferred timestamps after animation"),a.appendChild(Cn),Cn=null,mn(),fn(),a.style.visibility==="hidden"&&(a.style.visibility="",d("Restoring timestamp visibility after append")),mt&&(mt(),mt=null,Jt=null),It(),Qe(),Fe&&requestAnimationFrame(Fe),Ct(!0)}let Ae=null,ie=!1,Pe="ytls-timestamp-pending-delete",Ge="ytls-timestamp-highlight",St="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_64px_Indexed.png",An="https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/assets/Kamo_Eyebrow_64px_Indexed.png";function or(){let l=m=>{let h=new Image;h.src=m};l(St),l(An)}or();async function Mn(){for(;!document.querySelector("video")||!document.querySelector("#movie_player");)await new Promise(l=>setTimeout(l,100));for(;!document.querySelector(".ytp-progress-bar");)await new Promise(l=>setTimeout(l,100));await new Promise(l=>setTimeout(l,200))}let cn=["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"],un=5e3,Or=new Set(["getCurrentTime","seekTo","getPlayerState","seekToLiveHead","getVideoData","getDuration"]);function ya(l){return Or.has(l)}function gt(){return document.querySelector("video")}let Ln=null;function ye(){if(Ln&&document.contains(Ln))return Ln;let l=document.getElementById("movie_player");return l&&document.contains(l)?l:null}function ba(l){return(Math.round(l*100)/100).toFixed(2).replace(/\.0+?$|(?<=\.[0-9])0+$/g,"")}function Ec(l){let m=l===1?2:l;g=m;try{localStorage.setItem("ytls-last-speed",String(m))}catch{}}function ci(l){if(!u)return;let m=typeof l=="number"?l:gt()?.playbackRate??1,h=ba(m);u.textContent=`${h}x`,u.setAttribute("aria-label",`Playback speed ${h}x`),Math.abs(m-1)>.01?u.classList.add("ytls-playback-speed-active"):u.classList.remove("ytls-playback-speed-active")}function _c(l){let m=ye(),h=gt();if(y=!0,m&&typeof m.setPlaybackRate=="function")m.setPlaybackRate(l);else if(h)h.playbackRate=l;else return y=!1,!1;return ci(l),!0}function wa(){let l=gt()?.playbackRate;return Number.isFinite(l)?_c(Math.abs(l-1)<=.001?g:1):!1}function Ac(l){return l instanceof Element?!!l.closest('input, textarea, select, [contenteditable], [role="textbox"]'):!1}function ui(l){return cn.every(m=>typeof l?.[m]=="function"?!0:ya(m)?!!gt():!1)}function Mc(l){return cn.filter(m=>typeof l?.[m]=="function"?!1:ya(m)?!gt():!0)}async function Lc(l=un){let m=Date.now();for(;Date.now()-m<l;){let w=ye();if(ui(w))return w;await new Promise(E=>setTimeout(E,100))}let h=ye();return ui(h),h}let xa="timestampOffsetSeconds",Ic=-5,ka="shiftClickTimeSkipSeconds",Cc=10,di=300,pi=300,Nt=null;function Ta(){try{return new URL(window.location.href).origin==="https://www.youtube.com"}catch{return!1}}function Sa(){if(Ta()&&!Nt)try{Nt=new BroadcastChannel("ytls_timestamp_channel"),Nt.onmessage=Ea}catch(l){d("Failed to create BroadcastChannel:",l,"warn"),Nt=null}}function Nr(l){if(!Ta()){d("Skipping BroadcastChannel message: not on https://www.youtube.com","warn");return}if(Sa(),!Nt){d("No BroadcastChannel available to post message","warn");return}try{Nt.postMessage(l)}catch(m){d("BroadcastChannel error, reopening:",m,"warn");try{Nt=new BroadcastChannel("ytls_timestamp_channel"),Nt.onmessage=Ea,Nt.postMessage(l)}catch(h){d("Failed to reopen BroadcastChannel:",h,"error")}}}function Ea(l){if(d("Received message from another tab:",l.data),!(!i()||!a||!o)&&l.data){if(l.data.type==="timestamps_updated"&&l.data.videoId===Oe)d("Debouncing timestamp load due to external update for video:",l.data.videoId),clearTimeout(Hr),Hr=setTimeout(()=>{d("Reloading timestamps due to external update for video:",l.data.videoId),bi()},500);else if(l.data.type==="window_position_updated"&&o){let m=l.data.position;if(m&&typeof m.x=="number"&&typeof m.y=="number"){o.style.left=`${m.x}px`,o.style.top=`${m.y}px`,o.style.right="auto",o.style.bottom="auto",typeof m.width=="number"&&m.width>0&&(o.style.width=`${m.width}px`),typeof m.height=="number"&&m.height>0&&(o.style.height=`${m.height}px`);let h=o.getBoundingClientRect();V({x:Math.round(m.x),y:Math.round(m.y),width:Math.round(h.width),height:Math.round(h.height)});let w=document.documentElement.clientWidth,E=document.documentElement.clientHeight;(h.left<0||h.top<0||h.right>w||h.bottom>E)&&cr()}}}}Sa();let ir=await ha(xa);(typeof ir!="number"||Number.isNaN(ir))&&(ir=Ic,await ga(xa,ir));let zr=await ha(ka);(typeof zr!="number"||Number.isNaN(zr))&&(zr=Cc,await ga(ka,zr));let Hr=null,In=new Map,ar=!1,G=null,ho=null,Oe=null,Et=null,Ce=null,_t=null,it=null,dn=null,mi=!1,Fe=null,Cn=null,Jt=null,mt=null,pn=null,go=!1,mm=null,fi=!1,vo=null,yo=null,bo=null,wo=null,xo=null,ko=null,To=null,So=null,$r=null,Fr=null,jr=null,At=null,Mt=null,_a=0,Vr=!1,Dn=null,Ur=null;function be(){return ei(a)}function hi(){return wl(a)}function Lt(){return Ur!==null||(Ur=xl(a)),Ur}function mn(){Ur=null}function Dc(l){let m=l.querySelector(".time-diff");return m?(m.textContent?.trim()||"").startsWith("-"):!1}let Bc="\u251C\u2500 ",Aa="\u2514\u2500 ",Ma=/^[├└]─\s/;function Eo(l){return Ma.test(l)}function La(l){return l.replace(Ma,"")}function Ia(l){let m=be();if(l>=m.length-1)return Aa;let E=m[l+1].querySelector("input");return E&&Eo(E.value)?Bc:Aa}function Rc(l,m){return`${Ia(m)}${l}`}function It(){if(!a)return;be().forEach((m,h)=>{let w=m.querySelector("input");if(!w||!Eo(w.value))return;let E=La(w.value),_=Rc(E,h);w.value!==_&&(w.value=_)})}function Gr(){ti(a),Cn&&(Cn=null),mt&&(mt(),mt=null,Jt=null)}function qr(){bl(a,ie)}function Ca(l){$i(a,l)}function gi(){gl(a)}function vi(l){if(!(!o||!a)){if(ie=l,l)o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),Ca("Loading timestamps...");else if(gi(),o.style.display="",o.classList.remove("ytls-fade-out"),o.classList.add("ytls-fade-in"),c){let m=ye();if(m){let h=m.getCurrentTime(),w=Number.isFinite(h)?Math.max(0,Math.floor(h)):Math.max(0,Lt()),{isLive:E}=m.getVideoData()||{isLive:!1},_=a?be().map(b=>{let L=b.querySelector("[data-time]");return L?parseFloat(L.getAttribute("data-time")??"0"):0}):[],k="";if(_.length>0)if(E){let b=Math.max(1,w/60),L=_.filter(O=>O<=w);if(L.length>0){let O=(L.length/b).toFixed(2);parseFloat(O)>0&&(k=` (${O}/min)`)}}else{let b=m.getDuration(),L=Number.isFinite(b)&&b>0?b:0,O=Math.max(1,L/60),q=(_.length/O).toFixed(1);parseFloat(q)>0&&(k=` (${q}/min)`)}c.textContent=`${Vt(w)}${k}`}}!ie&&a&&!no(a)&&qr(),Xt()}}function Pc(l){return l?Mr.safeParse(l).success:!1}function _o(l,m){l.dataset.time=String(m),l.textContent=Vt(m,Lt())}let Ao=null,Mo=null,zt=!1;function Da(l){if(!l||typeof l.getVideoData!="function"||!l.getVideoData()?.isLive)return!1;if(typeof l.getProgressState=="function"){let h=l.getProgressState(),w=Number(h?.seekableEnd??h?.liveHead??h?.head??h?.duration),E=Number(h?.current??l.getCurrentTime?.());if(Number.isFinite(w)&&Number.isFinite(E))return w-E>2}return!1}function Oc(l,m){if(!Number.isFinite(l))return;let h=Ba(l);yi(h,m)}function Ct(l=!1,m){if(ar&&!l)return;let h;if(typeof m=="number"&&Number.isFinite(m))h=Math.max(0,Math.floor(m));else{let w=ye(),E=w?w.getCurrentTime():NaN;h=Number.isFinite(E)?Math.max(0,Math.floor(E)):Math.max(0,Lt())}Number.isFinite(h)&&Oc(h,l)}function Ba(l){if(!Number.isFinite(l))return null;let m=be();if(m.length===0)return null;let h=null,w=-1/0;for(let E of m){let k=E.querySelector("[data-time]")?.dataset.time;if(!k)continue;let b=Number.parseInt(k,10);Number.isFinite(b)&&b<=l&&b>w&&(w=b,h=E)}return h}function yi(l,m=!1){if(be().forEach(w=>{w.classList.contains(Pe)||w.classList.remove(Ge)}),!!l&&!l.classList.contains(Pe)&&(l.classList.add(Ge),m))try{if(a instanceof HTMLElement){let w=l.getBoundingClientRect(),E=a.getBoundingClientRect();!(w.bottom<E.top||w.top>E.bottom)||l.scrollIntoView({behavior:"smooth",block:"center"})}else l.scrollIntoView({behavior:"smooth",block:"center"})}catch{try{l.scrollIntoView({behavior:"smooth",block:"center"})}catch{}}}function Nc(l){if(Ht()||!Number.isFinite(l)||l===0)return!1;let m=be();if(m.length===0)return!1;let h=!1;return m.forEach(w=>{let E=w.querySelector("[data-time]"),_=E?.dataset.time;if(!E||!_)return;let k=Number.parseInt(_,10);if(!Number.isFinite(k))return;let b=Math.max(0,k+l);b!==k&&(_o(E,b),h=!0)}),h?(fn(),It(),Qe(),Io(Oe),Dn=null,!0):!1}function Ra(l,m={}){if(!Number.isFinite(l)||l===0)return!1;if(!Nc(l)){if(m.alertOnNoChange){let k=m.failureMessage??"Offset did not change any timestamps.";alert(k)}return!1}let w=m.logLabel??"bulk offset";d(`Timestamps changed: Offset all timestamps by ${l>0?"+":""}${l} seconds (${w})`);let E=ye(),_=E?Math.floor(E.getCurrentTime()):0;if(Number.isFinite(_)){let k=Ba(_);yi(k,!1)}return!0}function Pa(l){if(!a||ie)return;let m=l.target instanceof Element?l.target:null;if(!m)return;let h=m.closest("[data-time]"),w=m.closest("[data-increment]"),E=m.closest("[data-action]");if(h?.dataset.time){l.preventDefault();let _=Number(h.dataset.time);if(Number.isFinite(_)){d(`Seeking to timestamp ${_}`),zt=!0;let b=ye();b&&b.seekTo(_),setTimeout(()=>{zt=!1},500)}let k=h.closest("li");k&&(be().forEach(b=>{b.classList.contains(Pe)||b.classList.remove(Ge)}),k.classList.contains(Pe)||(k.classList.add(Ge),k.scrollIntoView({behavior:"smooth",block:"center"})))}else if(w?.dataset.increment){l.preventDefault();let _=w.closest("li"),k=_?.querySelector("[data-time]");if(!k||!k.dataset.time)return;let b=parseInt(k.dataset.time,10),L=parseInt(w.dataset.increment,10);if("shiftKey"in l&&l.shiftKey&&(L*=zr),"altKey"in l?l.altKey:!1){Ra(L,{logLabel:"Alt adjust"});return}let re=Math.max(0,b+L);if(d(`Timestamps changed: Timestamp time incremented from ${b} to ${re}`),mn(),_o(k,re),Mo=re,Ao&&clearTimeout(Ao),zt=!0,Ao=setTimeout(()=>{if(Mo!==null){let me=ye();me&&me.seekTo(Mo)}Ao=null,Mo=null,setTimeout(()=>{zt=!1},500)},500),fn(),It(),Qe(),_){let me=_.querySelector("input"),Se=_.dataset.guid;me&&Se&&(sr(Oe,Se,re,me.value),Dn=Se)}}else E?.dataset.action==="clear"&&(l.preventDefault(),d("Timestamps changed: All timestamps cleared from UI"),a.textContent="",mn(),Qe(),Lo(),Io(Oe,{allowEmpty:!0}),Dn=null,qr())}function Zr(l,m="",h=!1,w=null,E=!0){if(!a)return null;let _=Math.max(0,l),k=w??crypto.randomUUID(),b=document.createElement("li"),L=document.createElement("div"),O=document.createElement("span"),q=document.createElement("span"),re=document.createElement("span"),me=document.createElement("div"),Se=document.createElement("span"),at=document.createElement("span"),oe=document.createElement("input"),Ne=document.createElement("button");b.dataset.guid=k,L.className="time-row",me.className="ytls-row-controls";let et=document.createElement("div");et.style.cssText="position:absolute;left:0;top:0;width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;",dt(et,"Click to toggle indent");let tt=document.createElement("span");tt.style.cssText="color:#f4ba78;pointer-events:none;display:none;line-height:0;";let hn=()=>{let Q=oe.offsetTop,ee=oe.offsetHeight||20;et.style.top=`${Q}px`,et.style.height=`${ee}px`},Bn=()=>{We(tt,Eo(oe.value)?"indent-decrease":"indent-increase",18)},ur="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",gn=Q=>{let ee=tt.querySelector("svg");ee&&(ee.style.transition="filter 0.15s ease",ee.style.filter=Q?ur:"none")},dr=Q=>{Q.stopPropagation();let ee=Eo(oe.value),fe=La(oe.value),ce="";if(!ee){let vt=be().indexOf(b);ce=Ia(vt)}oe.value=ce?`${ce}${fe}`:fe,Bn(),It();let _e=Number.parseInt(Se.dataset.time??"0",10);sr(Oe,k,_e,oe.value)};et.onclick=dr,et.append(tt),et.addEventListener("mouseenter",()=>{gn(!0)}),et.addEventListener("mouseleave",()=>{gn(!1)}),b.style.cssText="position:relative;padding-left:20px;",b.addEventListener("mouseenter",()=>{hn(),Bn(),tt.style.display="inline"}),b.addEventListener("mouseleave",()=>{gn(!1),tt.style.display="none"}),b.addEventListener("mouseleave",()=>{b.dataset.guid===Dn&&Dc(b)&&Oa()}),oe.value=m||"",oe.style.cssText="width:100%;margin-top:5px;display:block;",oe.type="text",oe.setAttribute("inputmode","text"),oe.autocapitalize="off",oe.autocomplete="off",oe.spellcheck=!1,requestAnimationFrame(hn);let Wr=!1;oe.addEventListener("focusin",()=>{Vr=!1,Wr=!1}),oe.addEventListener("focusout",Q=>{let ee=Q.relatedTarget,fe=Date.now()-_a<250,ce=!!ee&&!!o&&o.contains(ee);!fe&&!ce&&!Wr&&(Vr=!0,setTimeout(()=>{(document.activeElement===document.body||document.activeElement==null)&&(oe.focus({preventScroll:!0}),Vr=!1)},0))}),oe.addEventListener("keydown",Q=>{(Q.key==="Escape"||Q.key==="Esc")&&(Q.preventDefault(),Wr=!0,oe.blur())}),oe.addEventListener("input",Q=>{let ee=Q;if(ee&&(ee.isComposing||ee.inputType==="insertCompositionText"))return;let fe=In.get(k);fe&&clearTimeout(fe);let ce=setTimeout(()=>{let _e=Number.parseInt(Se.dataset.time??"0",10);sr(Oe,k,_e,oe.value),In.delete(k)},500);In.set(k,ce)}),oe.addEventListener("compositionend",()=>{let Q=Number.parseInt(Se.dataset.time??"0",10);setTimeout(()=>{sr(Oe,k,Q,oe.value)},50)});let Bo="#f4ba78",Qt="drop-shadow(0 0 4px #eee8cf) drop-shadow(0 0 8px #eee8cf)",Ro="#c8452d",Po="drop-shadow(0 0 4px #e36a52) drop-shadow(0 0 8px #e36a52)",Rn=(Q,ee=Bo,fe=Qt)=>{Q.style.color=ee;let ce=Q.querySelector("svg");ce&&(ce.style.transition="filter 0.15s ease"),Q.addEventListener("mouseenter",()=>{ce&&(ce.style.filter=fe)}),Q.addEventListener("mouseleave",()=>{ce&&(ce.style.filter="none")})};We(O,"circle-minus",18),O.classList.add("ytls-row-control"),O.dataset.increment="-1",O.style.cursor="pointer",O.style.margin="0px",Rn(O),We(re,"circle-plus",18),re.classList.add("ytls-row-control"),re.dataset.increment="1",re.style.cursor="pointer",re.style.margin="0px",Rn(re),We(q,"current-location",18),q.classList.add("ytls-row-control"),q.style.cursor="pointer",q.style.margin="0px",dt(q,"Set to current playback time"),Rn(q),q.onclick=()=>{let Q=ye(),ee=Q?Math.floor(Q.getCurrentTime()):0;Number.isFinite(ee)&&(d(`Timestamps changed: set to current playback time ${ee}`),mn(),_o(Se,ee),fn(),It(),sr(Oe,k,ee,oe.value),Dn=k)},mn(),_o(Se,_),Se.addEventListener("click",Q=>{Q.preventDefault(),Q.stopPropagation();let ee=Number(Se.dataset.time);if(!Number.isFinite(ee))return;d(`Seeking to timestamp ${ee}`),zt=!0;let fe=ye();fe&&fe.seekTo(ee);let ce=gt();ce?.paused&&ce.play(),setTimeout(()=>{zt=!1},500),a?.querySelectorAll(`.${Ge}`).forEach(_e=>_e.classList.remove(Ge)),b.classList.contains(Pe)||(b.classList.add(Ge),b.scrollIntoView({behavior:"smooth",block:"center"}))}),We(Ne,"trash",16),Ne.classList.add("ytls-row-control"),Ne.style.cssText="background:transparent;border:none;cursor:pointer;margin-left:5px;display:inline-flex;align-items:center;",Rn(Ne,Ro,Po),Ne.onclick=()=>{let Q=null,ee=null,fe=null,ce=()=>{try{b.removeEventListener("click",ee,!0)}catch{}try{document.removeEventListener("click",ee,!0)}catch{}if(a)try{a.removeEventListener("mouseleave",fe)}catch{}Q&&(clearTimeout(Q),Q=null)};if(b.dataset.deleteConfirmed==="true"){d("Timestamps changed: Timestamp deleted");let _e=b.dataset.guid??"",nt=In.get(_e);nt&&(clearTimeout(nt),In.delete(_e)),ce(),b.remove(),mn(),fn(),It(),Qe(),Lo(),zc(Oe,_e),Dn=null,qr()}else{b.dataset.deleteConfirmed="true",b.classList.add(Pe),b.classList.remove(Ge);let _e=()=>{b.dataset.deleteConfirmed="false",b.classList.remove(Pe);let nt=ye(),vt=nt?nt.getCurrentTime():0,pr=Number.parseInt(b.querySelector("[data-time]")?.dataset.time??"0",10);Number.isFinite(vt)&&Number.isFinite(pr)&&vt>=pr&&b.classList.add(Ge),ce()};ee=nt=>{nt.target!==Ne&&_e()},fe=()=>{b.dataset.deleteConfirmed==="true"&&_e()},b.addEventListener("click",ee,!0),document.addEventListener("click",ee,!0),a&&a.addEventListener("mouseleave",fe),Q=setTimeout(()=>{b.dataset.deleteConfirmed==="true"&&_e(),ce()},5e3)}},at.className="time-diff",at.style.color="#888",at.style.marginLeft="5px",me.append(O,q,re,Ne),L.append(Se,me,at),b.append(et,L,oe);let Oo=Number.parseInt(Se.dataset.time??"0",10);if(E){gi();let Q=!1,ee=be();for(let fe=0;fe<ee.length;fe++){let ce=ee[fe],nt=ce.querySelector("[data-time]")?.dataset.time;if(!nt)continue;let vt=Number.parseInt(nt,10);if(Number.isFinite(vt)&&Oo<vt){a.insertBefore(b,ce),Q=!0;break}}Q||a.appendChild(b),b.scrollIntoView({behavior:"smooth",block:"center"}),mn(),fn(),Lo(),It(),Qe(),h||(sr(Oe,k,_,m),Dn=k,yi(b,!1))}else oe.__ytls_li=b;return oe}function fn(){if(Ht())return;let l=Lt(),m=be();m.forEach((h,w)=>{let E=h.querySelector(".time-diff"),_=h.querySelector("[data-time]"),k=_?.dataset.time;if(_&&k){let at=Number.parseInt(k,10);Number.isFinite(at)&&(_.textContent=Vt(at,l))}if(!E)return;if(!k){E.textContent="";return}let b=Number.parseInt(k,10);if(!Number.isFinite(b)){E.textContent="";return}if(w===0){E.textContent="";return}let q=m[w-1].querySelector("[data-time]")?.dataset.time;if(!q){E.textContent="";return}let re=Number.parseInt(q,10);if(!Number.isFinite(re)){E.textContent="";return}let me=b-re,Se=me<0?"-":"";E.textContent=` ${Se}${Vt(Math.abs(me))}`})}function Oa(){if(Ht())return;let l=null;if(document.activeElement instanceof HTMLInputElement&&a.contains(document.activeElement)){let k=document.activeElement,L=k.closest("li")?.dataset.guid;if(L){let O=k.selectionStart??k.value.length,q=k.selectionEnd??O,re=k.scrollLeft;l={guid:L,start:O,end:q,scroll:re}}}let m=be();if(m.length===0)return;let h=m.map(k=>k.dataset.guid),w=m.map(k=>{let b=k.querySelector("[data-time]"),L=b?.dataset.time;if(!b||!L)return null;let O=Number.parseInt(L,10);if(!Number.isFinite(O))return null;let q=k.dataset.guid??"";return{time:O,guid:q,element:k}}).filter(k=>k!==null).sort((k,b)=>{let L=k.time-b.time;return L!==0?L:k.guid.localeCompare(b.guid)}),E=w.map(k=>k.guid),_=h.length!==E.length||h.some((k,b)=>k!==E[b]);if(a.replaceChildren(),w.forEach(k=>{a.appendChild(k.element)}),fn(),It(),Qe(),l){let b=be().find(L=>L.dataset.guid===l.guid)?.querySelector("input");if(b)try{b.focus({preventScroll:!0})}catch{}}_&&(d("Timestamps changed: Timestamps sorted"),Io(Oe))}function Lo(){if(!a||!o||!s||!p)return;let l=be().length;Fe?.();let m=o.getBoundingClientRect(),h=s.getBoundingClientRect(),w=p.getBoundingClientRect(),E=Math.max(0,m.height-(h.height+w.height));l===0?(qr(),a.style.overflowY="hidden"):a.style.overflowY=a.scrollHeight>E?"auto":"hidden"}function Qe(){if(!a)return;let l=gt(),m=document.querySelector(".ytp-progress-bar"),h=ye(),w=h?h.getVideoData():null,E=!!w&&!!w.isLive;if(!l||!m||!isFinite(l.duration)||E)return;za(),be().map(k=>{let b=k.querySelector("[data-time]"),L=b?.dataset.time;if(!b||!L)return null;let O=Number.parseInt(L,10);if(!Number.isFinite(O))return null;let re=k.querySelector("input")?.value??"",me=k.dataset.guid??crypto.randomUUID();return k.dataset.guid||(k.dataset.guid=me),{start:O,comment:re,guid:me}}).filter(Pc).forEach(k=>{if(!Number.isFinite(k.start))return;let b=document.createElement("div");b.className="ytls-marker",b.style.position="absolute",b.style.height="100%",b.style.width="2px",b.style.backgroundColor="#ff0000",b.style.cursor="pointer",b.style.left=k.start/l.duration*100+"%",b.dataset.time=String(k.start),b.addEventListener("click",()=>{let L=ye();L&&L.seekTo(k.start)}),m.appendChild(b)})}function Io(l,m={}){if(!a||Ht()||!l)return;if(ie){d("Save blocked: timestamps are currently loading");return}It();let h=hi().sort((w,E)=>w.start-E.start);if(h.length===0&&!m.allowEmpty){d("Save skipped: no timestamps to save");return}xe(h),Ha(l,h).then(()=>{d(`Successfully saved ${h.length} timestamps for ${l} to IndexedDB`),Co()}).catch(w=>{let E=`Failed to save timestamps: ${w.message}`;d(`Failed to save timestamps for ${l} to IndexedDB:`,w,"error"),lr(E)}),Nr({type:"timestamps_updated",videoId:l,action:"saved"})}function sr(l,m,h,w){if(!l||ie||Ht())return;let E={guid:m,start:h,comment:w};d(`Saving timestamp: guid=${m}, start=${h}, comment="${w}"`),Uc(l,E).then(()=>{a&&Co()}).catch(_=>{let k=`Failed to save timestamp: ${_.message}`;d(`Failed to save timestamp ${m}:`,_,"error"),lr(k)}),Nr({type:"timestamps_updated",videoId:l,action:"saved"})}function zc(l,m){!l||ie||Ht()||(Gc(l,m).then(()=>{a&&Co()}).catch(h=>{let w=`Failed to delete timestamp: ${h.message}`;d(`Failed to delete timestamp ${m}:`,h,"error"),lr(w)}),Nr({type:"timestamps_updated",videoId:l,action:"saved"}))}async function Na(l){if(Ht()){alert("Cannot export timestamps while an error is being displayed.");return}let m=Oe;if(!m)return;d(`Exporting timestamps for video ID: ${m}`);let h=hi(),w=Math.max(Lt(),0),E=Qn();if(l==="json"){let _=new Blob([JSON.stringify(h,null,2)],{type:"application/json"}),k=URL.createObjectURL(_),b=document.createElement("a");b.href=k,b.download=`timestamps-${m}-${E}.json`,b.click(),URL.revokeObjectURL(k)}else if(l==="text"){let _=h.map(O=>{let q=Vt(O.start,w),re=`${O.comment} <!-- guid:${O.guid} -->`.trimStart();return`${q} ${re}`}).join(`
`),k=new Blob([_],{type:"text/plain"}),b=URL.createObjectURL(k),L=document.createElement("a");L.href=b,L.download=`timestamps-${m}-${E}.txt`,L.click(),URL.revokeObjectURL(b)}}function lr(l){if(!o||!a){d("Timekeeper error:",l,"error");return}vl(a,l),Gi(l),Qe()}function Co(){a&&(yl(a),Gi(null))}function Ht(){return!!(!a||no(a)||ie||Ll()!==null)}function za(){document.querySelectorAll(".ytls-marker").forEach(l=>l.remove())}function cr(){if(!o||!document.body.contains(o))return;let l=o.getBoundingClientRect(),m=document.documentElement.clientWidth,h=document.documentElement.clientHeight,w=l.width,E=l.height;if(l.left<0&&(o.style.left="0",o.style.right="auto"),l.right>m){let _=Math.max(0,m-w);o.style.left=`${_}px`,o.style.right="auto"}if(l.top<0&&(o.style.top="0",o.style.bottom="auto"),l.bottom>h){let _=Math.max(0,h-E);o.style.top=`${_}px`,o.style.bottom="auto"}}function Hc(){if(vo&&(document.removeEventListener("mousemove",vo),vo=null),yo&&(document.removeEventListener("mouseup",yo),yo=null),$r&&(document.removeEventListener("keydown",$r),$r=null),bo&&(window.removeEventListener("resize",bo),bo=null),Fr&&(document.removeEventListener("pointerdown",Fr,!0),Fr=null),jr&&(document.removeEventListener("pointerup",jr,!0),jr=null),At){try{At.disconnect()}catch{}At=null}if(Mt){try{Mt.disconnect()}catch{}Mt=null}let l=gt();l&&(wo&&(l.removeEventListener("timeupdate",wo),wo=null),xo&&(l.removeEventListener("pause",xo),xo=null),ko&&(l.removeEventListener("play",ko),ko=null),To&&(l.removeEventListener("seeking",To),To=null),So&&(l.removeEventListener("ratechange",So),So=null))}function $c(){za(),In.forEach(m=>clearTimeout(m)),In.clear(),Hr&&(clearTimeout(Hr),Hr=null),Ae&&(clearInterval(Ae),Ae=null),Et&&(clearTimeout(Et),Et=null),Hc(),Ws();try{Nt.close()}catch{}if(G&&G.parentNode===document.body&&document.body.removeChild(G),G=null,ho=null,ar=!1,Oe=null,At){try{At.disconnect()}catch{}At=null}if(Mt){try{Mt.disconnect()}catch{}Mt=null}o&&o.parentNode&&o.remove();let l=document.getElementById("ytls-header-button");l&&l.parentNode&&l.remove(),pn=null,go=!1,V(null),Gr(),o=null,s=null,a=null,p=null,it=null,dn=null,Fe=null,c=null,u=null,A=null,Ln=null}async function Fc(){let l=wi();if(!l)return Ln=null,{ok:!1,message:"Timekeeper cannot determine the current video ID. Please refresh the page or open a standard YouTube watch URL."};let m=await Lc();if(!ui(m)){let h=Mc(m),w=h.length?` Missing methods: ${h.join(", ")}.`:"",E=m?"Timekeeper cannot access the YouTube player API.":"Timekeeper cannot find the YouTube player on this page.";return Ln=null,{ok:!1,message:`${E}${w} Try refreshing once playback is ready.`}}return Ln=m,{ok:!0,player:m,videoId:l}}async function bi(){if(!o||!a)return;let l=a.scrollTop,m=!0,h=()=>{if(!a||!m)return;let w=Math.max(0,a.scrollHeight-a.clientHeight);a.scrollTop=Math.min(l,w)};try{let w=await Fc();if(!w.ok){lr(w.message),Gr(),Qe();return}let{videoId:E}=w,_=[];try{let k=await qc(E);k?(_=k.map(b=>({...b,guid:b.guid||crypto.randomUUID()})),d(`Loaded ${_.length} timestamps from IndexedDB for ${E}`),Co()):d(`No timestamps found in IndexedDB for ${E}`)}catch(k){let b=`Failed to load timestamps: ${k.message}`;d(`Failed to load timestamps from IndexedDB for ${E}:`,k,"error"),lr(b),Qe();return}if(_.length>0){_.sort((L,O)=>L.start-O.start),Gr(),gi();let k=document.createDocumentFragment();_.forEach(L=>{let q=Zr(L.start,L.comment,!0,L.guid,!1).__ytls_li;q&&k.appendChild(q)}),o&&o.classList.contains("ytls-zoom-in")&&Ce!=null?(d("Deferring timestamp DOM append until show animation completes"),Cn=k,Jt||(Jt=new Promise(L=>{mt=L})),await Jt):a&&(a.appendChild(k),mn(),fn(),It(),Qe(),Fe&&requestAnimationFrame(Fe)),xe(_),Ct(!0),m=!1}else Gr(),Ca("No timestamps for this video"),Qe(),xe([]),Fe&&requestAnimationFrame(Fe)}catch(w){d("Unexpected error while loading timestamps:",w,"error"),lr("Timekeeper encountered an unexpected error while loading timestamps. Check the console for details.")}finally{Jt&&await Jt,requestAnimationFrame(h),Fe&&requestAnimationFrame(Fe),a&&!no(a)&&qr()}}function wi(){let m=new URLSearchParams(location.search).get("v");if(m)return m;let h=document.querySelector('meta[itemprop="identifier"]');return h?.content?h.content:null}function jc(l=null,m=null){if(!c)return;let h=gt(),w=m||ye();if(!h&&!w)return;let E=l!==null?l:w?w.getCurrentTime():0,_=Number.isFinite(E)?Math.max(0,Math.floor(E)):Math.max(0,Lt()),{isLive:k}=w?w.getVideoData()||{isLive:!1}:{isLive:!1},b=w?Da(w):!1,L=a?be().map(q=>{let re=q.querySelector("[data-time]");return re?parseFloat(re.getAttribute("data-time")??"0"):0}):[],O="";if(L.length>0)if(k){let q=Math.max(1,_/60),re=L.filter(me=>me<=_);if(re.length>0){let me=(re.length/q).toFixed(2);parseFloat(me)>0&&(O=` (${me}/min)`)}}else{let q=w?w.getDuration():0,re=Number.isFinite(q)&&q>0?q:h&&Number.isFinite(h.duration)&&h.duration>0?h.duration:0,me=Math.max(1,re/60),Se=(L.length/me).toFixed(1);parseFloat(Se)>0&&(O=` (${Se}/min)`)}c.textContent=`${Vt(_)}${O}`,c.style.color=b?"#ff4d4f":""}function Vc(){let l=gt();if(!l)return;let m=()=>{if(!a)return;let b=ye(),L=b?Math.floor(b.getCurrentTime()):0;Number.isFinite(L)&&(c&&!ie&&!zt&&jc(L,b),Ct(!1,L))},h=b=>{try{let L=new URL(window.location.href);b!==null&&Number.isFinite(b)?L.searchParams.set("t",`${Math.floor(b)}s`):L.searchParams.delete("t"),window.history.replaceState({},"",L.toString())}catch{}},w=()=>{let b=ye(),L=b?b.getCurrentTime():NaN,O=Number.isFinite(L)?Math.max(0,Math.floor(L)):Math.max(0,Lt());if(Number.isFinite(O)){h(O);try{Ct(!0)}catch(q){d("Failed to highlight nearest timestamp on pause:",q,"warn")}}},E=()=>{h(null);try{let b=ye(),L=b?b.getCurrentTime():NaN,O=Number.isFinite(L)?Math.max(0,Math.floor(L)):Math.max(0,Lt());Number.isFinite(O)&&Ct(!0)}catch(b){d("Failed to highlight nearest timestamp on play:",b,"warn")}},_=()=>{let b=gt();if(!b)return;let L=ye(),O=L?Math.floor(L.getCurrentTime()):0;Number.isFinite(O)&&(b.paused&&h(O),Ct(!0,O))},k=()=>{let b=l.playbackRate;y?y=!1:Ec(b),ci(b)};wo=m,xo=w,ko=E,To=_,So=k,l.addEventListener("timeupdate",m),l.addEventListener("pause",w),l.addEventListener("play",E),l.addEventListener("seeking",_),l.addEventListener("ratechange",k)}let{saveToIndexedDB:Ha,saveSingleTimestampToIndexedDB:Uc,deleteSingleTimestampFromIndexedDB:Gc,loadFromIndexedDB:qc,removeFromIndexedDB:Zc,saveGlobalSettings:Do,loadGlobalSettings:xi,buildExportPayload:Wc,mergeBackupData:Yc,exportAllTimestamps:Kc,buildExportCsvPayload:fm,exportAllTimestampsCsv:Jc}=Hi;function $a(){if(!o)return;let l=o.style.display!=="none";Do("uiVisible",l)}function Xt(l){let m=typeof l=="boolean"?l:!!o&&o.style.display!=="none",h=document.getElementById("ytls-header-button");h instanceof HTMLButtonElement&&h.setAttribute("aria-pressed",String(m)),pn&&!go&&pn.src!==St&&(pn.src=St)}function Xc(){o&&xi("uiVisible").then(l=>{let m=U.boolean().safeParse(l),h=m.success?m.data:void 0;typeof h=="boolean"?(h?(o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in")):o.style.display="none",Xt(h)):(!m.success&&l!==void 0&&d("UI visibility state failed validation, defaulting to visible",m.error.format(),"warn"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Xt(!0))}).catch(l=>{d("Failed to load UI visibility state:",l,"error"),o.style.display="flex",o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Xt(!0)})}function ki(l){if(!o){d("ERROR: togglePaneVisibility called but pane is null");return}document.body.contains(o)||(d("Pane not in DOM during toggle, appending it"),document.querySelectorAll("#ytls-pane").forEach(E=>{E!==o&&E.remove()}),document.body.appendChild(o));let m=document.querySelectorAll("#ytls-pane");m.length>1&&(d(`ERROR: Multiple panes detected in togglePaneVisibility (${m.length}), cleaning up`),m.forEach(E=>{E!==o&&E.remove()})),Et&&(clearTimeout(Et),Et=null);let h=o.style.display==="none";(typeof l=="boolean"?l:h)?(o.style.display="flex",o.classList.remove("ytls-fade-out"),o.classList.remove("ytls-zoom-out"),o.classList.add("ytls-zoom-in"),Xt(!0),$a(),Xe(),Ce&&(clearTimeout(Ce),Ce=null),Ce=setTimeout(()=>{Re(),Fe?.(),he(),ke(!0);try{Ct(!0)}catch(E){d("Failed to scroll to nearest timestamp after toggle:",E,"warn")}Ce=null},450)):(o.classList.remove("ytls-fade-in"),o.classList.remove("ytls-zoom-in"),o.classList.add("ytls-zoom-out"),Xt(!1),Tt())}function Fa(l){if(!a){d("UI is not initialized; cannot import timestamps.","warn");return}let m=!1;try{let h=JSON.parse(l),w=null;if(Array.isArray(h))w=h;else if(typeof h=="object"&&h!==null){let E=Oe;if(E){let _=`timekeeper-${E}`;h[_]&&Array.isArray(h[_].timestamps)&&(w=h[_].timestamps,d(`Found timestamps for current video (${E}) in export format`,"info"))}if(!w){let _=Object.keys(h).filter(k=>k.startsWith("ytls-"));if(_.length===1&&Array.isArray(h[_[0]].timestamps)){w=h[_[0]].timestamps;let k=h[_[0]].video_id;d(`Found timestamps for video ${k} in export format`,"info")}}}w&&Array.isArray(w)?w.every(_=>typeof _.start=="number"&&typeof _.comment=="string")?(w.forEach(_=>{if(_.guid){let k=be().find(b=>b.dataset.guid===_.guid);if(k){let b=k.querySelector("input");b&&(b.value=_.comment)}else Zr(_.start,_.comment,!1,_.guid)}else Zr(_.start,_.comment,!1,crypto.randomUUID())}),m=!0):d("Parsed JSON array, but items are not in the expected timestamp format. Trying as plain text.","warn"):d("Parsed JSON, but couldn't find valid timestamps. Trying as plain text.","warn")}catch{}if(!m){let h=l.split(`
`).map(w=>w.trim()).filter(w=>w);if(h.length>0){let w=!1;h.forEach(E=>{let _=E.match(/^(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*(.*)$/);if(_){w=!0;let k=parseInt(_[1])||0,b=parseInt(_[2]),L=parseInt(_[3]),O=k*3600+b*60+L,q=_[4]?_[4].trim():"",re=null,me=q,Se=q.match(/<!--\s*guid:([^>]+?)\s*-->/);Se&&(re=Se[1].trim(),me=q.replace(/<!--\s*guid:[^>]+?\s*-->/,"").trim());let at;if(re&&(at=be().find(oe=>oe.dataset.guid===re)),!at&&!re&&(at=be().find(oe=>{if(oe.dataset.guid)return!1;let et=oe.querySelector("[data-time]")?.dataset.time;if(!et)return!1;let tt=Number.parseInt(et,10);return Number.isFinite(tt)&&tt===O})),at){let oe=at.querySelector("input");oe&&(oe.value=me)}else Zr(O,me,!1,re||crypto.randomUUID())}}),w&&(m=!0)}}m?(d("Timestamps changed: Imported timestamps from file/clipboard"),It(),Io(Oe),Qe(),Lo()):alert("Failed to parse content. Please ensure it is in the correct JSON or plain text format.")}async function Qc(){if(fi){d("Pane initialization already in progress, skipping duplicate call");return}if(!(o&&document.body.contains(o))){fi=!0;try{let E=function(f=null,v=null){if(!c)return;let x=gt(),T=v||ye();if(!x&&!T)return;let D=f!==null?f:T?T.getCurrentTime():0,Y=Number.isFinite(D)?Math.max(0,Math.floor(D)):Math.max(0,Lt()),{isLive:$}=T?T.getVideoData()||{isLive:!1}:{isLive:!1},Z=T?Da(T):!1,F=a?be().map(de=>{let se=de.querySelector("[data-time]");return se?parseFloat(se.getAttribute("data-time")??"0"):0}):[],te="";if(F.length>0)if($){let de=Math.max(1,Y/60),se=F.filter(je=>je<=Y);if(se.length>0){let je=(se.length/de).toFixed(2);parseFloat(je)>0&&(te=` (${je}/min)`)}}else{let de=T?T.getDuration():0,se=Number.isFinite(de)&&de>0?de:x&&Number.isFinite(x.duration)&&x.duration>0?x.duration:0,je=Math.max(1,se/60),ft=(F.length/je).toFixed(1);parseFloat(ft)>0&&(te=` (${ft}/min)`)}c.textContent=`${Vt(Y)}${te}`,c.style.color=Z?"#ff4d4f":"",w();try{ci()}catch{}},_=function(){if(ie||zt)return;let f=ye();if(!f)return;let v=f.getCurrentTime(),x=Number.isFinite(v)?Math.max(0,Math.floor(v)):Math.max(0,Lt());E(x,f),(a?be():[]).length>0&&Ct(!1,x)},Ne=function(f,v,x,T){let D=document.createElement("button");return T?ge(D,T,f):D.textContent=f,dt(D,v),D.classList.add("ytls-settings-modal-button"),D.onclick=x,D},et=function(f="general"){if(G&&G.parentNode===document.body){let qe=document.getElementById("ytls-save-modal"),bn=document.getElementById("ytls-load-modal"),en=document.getElementById("ytls-delete-all-modal");qe&&document.body.contains(qe)&&document.body.removeChild(qe),bn&&document.body.contains(bn)&&document.body.removeChild(bn),en&&document.body.contains(en)&&document.body.removeChild(en),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",hn,!0),document.removeEventListener("keydown",tt)},300);return}G=document.createElement("div"),G.id="ytls-settings-modal",G.classList.remove("ytls-fade-out"),G.classList.add("ytls-fade-in");let v=document.createElement("div");v.className="ytls-modal-header";let x=document.createElement("div");x.id="ytls-settings-nav";let T=document.createElement("button");T.className="ytls-modal-close-button",We(T,"x",14),T.onclick=()=>{if(G&&G.parentNode===document.body){let qe=document.getElementById("ytls-save-modal"),bn=document.getElementById("ytls-load-modal"),en=document.getElementById("ytls-delete-all-modal");qe&&document.body.contains(qe)&&document.body.removeChild(qe),bn&&document.body.contains(bn)&&document.body.removeChild(bn),en&&document.body.contains(en)&&document.body.removeChild(en),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",hn,!0),document.removeEventListener("keydown",tt)},300)}};let D=document.createElement("div");D.id="ytls-settings-content";let Y=document.createElement("h3");Y.className="ytls-section-heading",Y.textContent="General",Y.style.display="none";let $=document.createElement("div"),Z=document.createElement("div");Z.className="ytls-button-grid";function F(qe){$.style.display=qe==="general"?"block":"none",Z.style.display=qe==="google"?"block":"none",te.classList.toggle("active",qe==="general"),se.classList.toggle("active",qe==="google"),Y.textContent=qe==="general"?"General":"Google"}let te=document.createElement("button");te.appendChild(Xr("adjustments-horizontal",16));let de=document.createElement("span");de.className="ytls-tab-text",de.textContent=" General",te.appendChild(de),dt(te,"General settings"),te.classList.add("ytls-settings-modal-button"),te.onclick=()=>F("general");let se=document.createElement("button");se.appendChild(Xr("cloud",16));let je=document.createElement("span");je.className="ytls-tab-text",je.textContent=" Google",se.appendChild(je),dt(se,"Google Drive backup settings"),se.classList.add("ytls-settings-modal-button"),se.onclick=async()=>{kt.isSignedIn&&await vc(),F("google")},x.appendChild(te),x.appendChild(se),v.appendChild(x),v.appendChild(T),G.appendChild(v),$.className="ytls-button-grid",$.appendChild(Ne("Save","Save As...",Bn.onclick,"device-floppy")),$.appendChild(Ne("Load","Load",ur.onclick,"folder-open")),$.appendChild(Ne("Export All","Export All Data",gn.onclick,"file-export")),$.appendChild(Ne("Import All","Import All Data",dr.onclick,"file-import")),$.appendChild(Ne("Export All (CSV)","Export All Timestamps to CSV",async()=>{try{await Jc()}catch{alert("Failed to export CSV: Could not read from database.")}},"file-spreadsheet"));let ft=Ne(kt.isSignedIn?"Sign Out":"Sign In",kt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive",async()=>{kt.isSignedIn?await gc():await fc(),ge(ft,kt.isSignedIn?"logout":"login",kt.isSignedIn?"Sign Out":"Sign In"),dt(ft,kt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),Me()},kt.isSignedIn?"logout":"login"),vr=Ne(mo()?"Auto Backup: On":"Auto Backup: Off","Toggle Auto Backup",async()=>{await Tc(),yn(),Me()},"refresh"),On=Ne(`Backup Interval: ${Yt()}min`,"Set periodic backup interval (minutes)",async()=>{await Sc(),yn(),Me()},"clock-plus"),yn=()=>{ge(ft,kt.isSignedIn?"logout":"login",kt.isSignedIn?"Sign Out":"Sign In"),dt(ft,kt.isSignedIn?"Sign out from Google Drive":"Sign in to Google Drive"),ge(vr,"refresh",mo()?"Auto Backup: On":"Auto Backup: Off"),ge(On,"clock-plus",`Backup Interval: ${Yt()}min`),typeof Me=="function"&&Me()};Z.appendChild(ft),Z.appendChild(vr),Z.appendChild(On),Z.appendChild(Ne("Backup Now","Run a backup immediately",async()=>{await po({silent:!1,skipBackoff:!0}),yn()},"database"));let yt=document.createElement("div");yt.style.marginTop="15px",yt.style.paddingTop="10px",yt.style.borderTop="1px solid #555",yt.style.fontSize="12px",yt.style.color="#aaa";let Vo=document.createElement("div");Vo.style.marginBottom="8px",Vo.style.fontWeight="bold",yt.appendChild(Vo),oc(Vo);let _i=document.createElement("div");_i.style.marginBottom="8px",nc(_i),yt.appendChild(_i);let Ja=document.createElement("div");rc(Ja),yt.appendChild(Ja),Z.appendChild(yt),pt(),Pr(),Me(),yn(),D.appendChild(Y),D.appendChild($),D.appendChild(Z),F(f==="drive"?"google":f),G.appendChild(D),document.body.appendChild(G),requestAnimationFrame(()=>{let qe=G.getBoundingClientRect(),en=(window.innerHeight-qe.height)/2;G.style.top=`${Math.max(20,en)}px`,G.style.transform="translateX(-50%)"}),setTimeout(()=>{document.addEventListener("click",hn,!0),document.addEventListener("keydown",tt)},0)},tt=function(f){if(f.key==="Escape"&&G&&G.parentNode===document.body){let v=document.getElementById("ytls-save-modal"),x=document.getElementById("ytls-load-modal"),T=document.getElementById("ytls-delete-all-modal");if(v||x||T)return;f.preventDefault(),v&&document.body.contains(v)&&document.body.removeChild(v),x&&document.body.contains(x)&&document.body.removeChild(x),T&&document.body.contains(T)&&document.body.removeChild(T),G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",hn,!0),document.removeEventListener("keydown",tt)},300)}},hn=function(f){if(ho&&ho.contains(f.target))return;let v=document.getElementById("ytls-save-modal"),x=document.getElementById("ytls-load-modal"),T=document.getElementById("ytls-delete-all-modal");v&&v.contains(f.target)||x&&x.contains(f.target)||T&&T.contains(f.target)||G&&G.contains(f.target)||(v&&document.body.contains(v)&&document.body.removeChild(v),x&&document.body.contains(x)&&document.body.removeChild(x),T&&document.body.contains(T)&&document.body.removeChild(T),G&&G.parentNode===document.body&&(G.classList.remove("ytls-fade-in"),G.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(G)&&document.body.removeChild(G),G=null,document.removeEventListener("click",hn,!0),document.removeEventListener("keydown",tt)},300)))},Wr=function(){o&&(d("Loading window position from IndexedDB"),xi("windowPosition").then(f=>{let v=Ks.safeParse(f);if(v.success){let T=v.data;o.style.left=`${T.x}px`,o.style.top=`${T.y}px`,o.style.right="auto",o.style.bottom="auto",typeof T.width=="number"&&T.width>0?o.style.width=`${T.width}px`:(o.style.width=`${di}px`,d(`No stored window width found, using default width ${di}px`)),typeof T.height=="number"&&T.height>0?o.style.height=`${T.height}px`:(o.style.height=`${pi}px`,d(`No stored window height found, using default height ${pi}px`));let D=Le();Be(D,T.x,T.y),d("Restored window position from IndexedDB:",X())}else v.success?d("No window position found in IndexedDB, applying default size and leaving default position"):d("Window position in IndexedDB failed validation:",v.error.format(),"warn"),o.style.width=`${di}px`,o.style.height=`${pi}px`,V(null);cr();let x=Le();x&&(x.width||x.height)&&Be(x),Fe?.()}).catch(f=>{d("failed to load pane position from IndexedDB:",f,"warn"),cr();let v=Le();v&&(v.width||v.height)&&V({x:Math.max(0,Math.round(v.left)),y:0,width:Math.round(v.width),height:Math.round(v.height)}),Fe?.()}))},Bo=function(){if(!o)return;let f=Le();if(!f)return;let v={x:Math.max(0,Math.round(f.left)),y:Math.max(0,Math.round(f.top)),width:Math.round(f.width),height:Math.round(f.height)},x=X();if(x&&x.x===v.x&&x.y===v.y&&x.width===v.width&&x.height===v.height){d("Skipping window position save; position and size unchanged");return}V({...v}),d(`Saving window position and size to IndexedDB: x=${v.x}, y=${v.y}, width=${v.width}, height=${v.height}`),Do("windowPosition",v),Nr({type:"window_position_updated",position:v,timestamp:Date.now()})},Ho=function(f,v){f.addEventListener("dblclick",x=>{x.preventDefault(),x.stopPropagation(),o&&(o.style.width="300px",o.style.height="300px",Bo(),jo())}),f.addEventListener("mousedown",x=>{x.preventDefault(),x.stopPropagation(),Pn=!0,vn=v,Ua=x.clientX,Ga=x.clientY;let T=o.getBoundingClientRect();mr=T.width,fr=T.height,No=T.left,zo=T.top,qa=document.documentElement.clientWidth,Za=document.documentElement.clientHeight,v==="top-left"||v==="bottom-right"?document.body.style.cursor="nwse-resize":document.body.style.cursor="nesw-resize"})},Ya=function(){if(!a||!dn)return;let{scrollTop:f,scrollHeight:v,clientHeight:x}=a;if(v<=x)return;let T=Math.max(30,x/v*x),D=f/(v-x)*(x-T);dn.style.height=`${T}px`,dn.style.top=`${D}px`},Ka=function(){it&&(Ei===null&&(Ei=requestAnimationFrame(()=>{Ei=null,Ya()})),it.classList.add("ytls-scrollbar-visible"),_t&&clearTimeout(_t),_t=setTimeout(()=>{it?.classList.remove("ytls-scrollbar-visible"),_t=null},500))},jo=function(){if(o&&s&&p&&a){let f=o.getBoundingClientRect(),v=s.getBoundingClientRect(),x=p.getBoundingClientRect(),T=f.height-(v.height+x.height);a.style.maxHeight=T>0?T+"px":"0px",a.style.overflowY=T>0?"auto":"hidden"}};if(document.querySelectorAll("#ytls-pane").forEach(f=>f.remove()),!document.getElementById("ytls-styles")){let f=document.createElement("style");f.id="ytls-styles",f.textContent=Gs,document.head.appendChild(f)}o=document.createElement("div"),s=document.createElement("div"),a=document.createElement("ul"),p=document.createElement("div"),c=document.createElement("span"),A=document.createElement("span"),R=document.createElement("span"),R.classList.add("ytls-backup-indicator"),R.style.cursor="pointer",R.style.backgroundColor="#666",R.onclick=f=>{f.stopPropagation(),et("drive")},a.addEventListener("mouseenter",()=>{ar=!0,ro(!0),Vr=!1}),a.addEventListener("mouseleave",()=>{ar=!1,ro(!1);try{Ci()}catch{}if(Vr)return;Ct(!1);let f=null;if(document.activeElement instanceof HTMLInputElement&&a.contains(document.activeElement)&&(f=document.activeElement.closest("li")?.dataset.guid??null),Oa(),f){let x=be().find(T=>T.dataset.guid===f)?.querySelector("input");if(x)try{x.focus({preventScroll:!0})}catch{}}}),o.id="ytls-pane",s.id="ytls-pane-header",s.addEventListener("dblclick",f=>{let v=f.target instanceof Element?f.target:null;if(v){let x=v;for(;x&&x!==o;){if(window.getComputedStyle(x).cursor==="pointer")return;x=x.parentElement}}f.preventDefault(),ki(!1)});let l=f=>{try{f.stopPropagation()}catch{}};["click","dblclick","mousedown","pointerdown","touchstart","wheel"].forEach(f=>{o.addEventListener(f,l)}),o.addEventListener("keydown",f=>{try{f.stopPropagation()}catch{}}),o.addEventListener("keyup",f=>{try{f.stopPropagation()}catch{}}),o.addEventListener("focus",f=>{try{f.stopPropagation()}catch{}},!0),o.addEventListener("blur",f=>{try{f.stopPropagation()}catch{}},!0),A.textContent=`v${Yo}`,A.classList.add("ytls-version-display");let m=document.createElement("span");m.style.display="inline-flex",m.style.alignItems="center",m.style.gap="6px",m.appendChild(A),m.appendChild(R),c.id="ytls-current-time",c.textContent="\u2014",c.style.cursor="default",dt(c,()=>{let f=ye(),{isLive:v}=f?f.getVideoData()||{isLive:!1}:{isLive:!1};return v?"Skip to live":""}),u=document.createElement("span"),u.id="ytls-playback-speed",u.textContent="1x",u.style.cursor="pointer",u.style.userSelect="none",dt(u,()=>`Current playback speed. Click to toggle between 1x and ${ba(g)}x.`),u.onclick=()=>{wa()},u.addEventListener("mousedown",f=>{f.stopPropagation()}),u.addEventListener("click",f=>{f.stopPropagation()}),c.onclick=()=>{let f=ye();if(!f)return;let{isLive:v}=f.getVideoData()||{isLive:!1};v&&(zt=!0,f.seekToLiveHead(),setTimeout(()=>{zt=!1},500))};let w=()=>{let f=ye();if(!f){c.style.cursor="default";return}let{isLive:v}=f.getVideoData()||{isLive:!1};c.style.cursor=v?"pointer":"default"};_(),Ae&&clearInterval(Ae),Ae=setInterval(_,1e3),p.id="ytls-buttons";let k=(f,v)=>()=>{f.classList.remove("ytls-fade-in"),f.classList.add("ytls-fade-out"),setTimeout(()=>{document.body.contains(f)&&document.body.removeChild(f),v&&v()},300)},b=f=>v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),f())},L=f=>{setTimeout(()=>{document.addEventListener("keydown",f)},0)},O=(f,v)=>x=>{f.contains(x.target)||v()},q=f=>{setTimeout(()=>{document.addEventListener("click",f,!0)},0)};[{id:"add",icon:"alarm-plus",title:"Add timestamp",action:()=>{if(Ht())return;let f=typeof ir<"u"?ir:0,v=ye(),x=v?Math.floor(v.getCurrentTime()+f):0;if(!Number.isFinite(x))return;let T=Zr(x,"");T&&T.focus()}},{id:"settings",icon:"settings",title:"Settings",action:()=>et()},{id:"copy",icon:"clipboard",title:"Copy timestamps to clipboard",action:function(f){if(Ht()){We(this,"circle-x",20),setTimeout(()=>{We(this,"clipboard",20)},2e3);return}let v=hi(),x=Math.max(Lt(),0);if(v.length===0){We(this,"circle-x",20),setTimeout(()=>{We(this,"clipboard",20)},2e3);return}let T=f.ctrlKey,D=v.map(Y=>{let $=Vt(Y.start,x);return T?`${$} ${Y.comment} <!-- guid:${Y.guid} -->`.trimStart():`${$} ${Y.comment}`}).join(`
`);navigator.clipboard.writeText(D).then(()=>{We(this,"circle-check",20),setTimeout(()=>{We(this,"clipboard",20)},2e3)}).catch(Y=>{d("Failed to copy timestamps: ",Y,"error"),We(this,"circle-x",20),setTimeout(()=>{We(this,"clipboard",20)},2e3)})}},{id:"offset",icon:"clock-plus",title:"Offset all timestamps",action:()=>{if(Ht())return;if(be().length===0){alert("No timestamps available to offset.");return}let v=prompt("Enter the number of seconds to offset all timestamps (positive or negative integer):","0");if(v===null)return;let x=v.trim();if(x.length===0)return;let T=Number.parseInt(x,10);if(!Number.isFinite(T)){alert("Please enter a valid integer number of seconds.");return}T!==0&&Ra(T,{alertOnNoChange:!0,failureMessage:"Offset had no effect because timestamps are already at the requested bounds.",logLabel:"bulk offset"})}},{id:"delete",icon:"trash",title:"Delete all timestamps for current video",action:async()=>{let f=wi();if(!f){alert("Unable to determine current video ID.");return}let v=document.createElement("div");v.id="ytls-delete-all-modal",v.classList.remove("ytls-fade-out"),v.classList.add("ytls-fade-in");let x=document.createElement("p");x.textContent="Hold the button to delete all timestamps for:",x.style.marginBottom="10px";let T=document.createElement("p");T.textContent=f,T.style.fontFamily="monospace",T.style.fontSize="12px",T.style.marginBottom="15px",T.style.color="#aaa";let D=document.createElement("button");D.classList.add("ytls-save-modal-button"),D.style.background="#d32f2f",D.style.position="relative",D.style.overflow="hidden";let Y=null,$=0,Z=null,F=document.createElement("div");F.style.position="absolute",F.style.left="0",F.style.top="0",F.style.height="100%",F.style.width="0%",F.style.background="#ff6b6b",F.style.transition="none",F.style.pointerEvents="none",D.appendChild(F);let te=document.createElement("span");te.textContent="Hold to Delete All",te.style.position="relative",te.style.zIndex="1",D.appendChild(te);let de=()=>{if(!$)return;let yn=Date.now()-$,yt=Math.min(yn/5e3*100,100);F.style.width=`${yt}%`,yt<100&&(Z=requestAnimationFrame(de))},se=()=>{Y&&(clearTimeout(Y),Y=null),Z&&(cancelAnimationFrame(Z),Z=null),$=0,F.style.width="0%",te.textContent="Hold to Delete All"};D.onmousedown=()=>{$=Date.now(),te.textContent="Deleting...",Z=requestAnimationFrame(de),Y=setTimeout(async()=>{se(),v.classList.remove("ytls-fade-in"),v.classList.add("ytls-fade-out"),setTimeout(async()=>{document.body.contains(v)&&document.body.removeChild(v);try{await Zc(f),Ti()}catch(yn){d("Failed to delete all timestamps:",yn,"error"),alert("Failed to delete timestamps. Check console for details.")}},300)},5e3)},D.onmouseup=se,D.onmouseleave=se;let je=null,ft=null,vr=k(v,()=>{se(),je&&document.removeEventListener("keydown",je),ft&&document.removeEventListener("click",ft,!0)});je=b(vr),ft=O(v,vr);let On=document.createElement("button");On.textContent="Cancel",On.classList.add("ytls-save-modal-cancel-button"),On.onclick=vr,v.appendChild(x),v.appendChild(T),v.appendChild(D),v.appendChild(On),document.body.appendChild(v),L(je),q(ft)}}].forEach(f=>{let v=document.createElement("button");We(v,f.icon,20),dt(v,f.title),v.classList.add("ytls-main-button"),f.id==="copy"?v.onclick=function(x){f.action.call(this,x)}:v.onclick=f.action,f.id==="settings"&&(ho=v),p.appendChild(v)});let Bn=document.createElement("button");ge(Bn,"device-floppy","Save"),Bn.classList.add("ytls-file-operation-button"),Bn.onclick=()=>{let f=document.createElement("div");f.id="ytls-save-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let v=document.createElement("p");v.textContent="Save as:";let x=null,T=null,D=k(f,()=>{x&&document.removeEventListener("keydown",x),T&&document.removeEventListener("click",T,!0)});x=b(D),T=O(f,D);let Y=document.createElement("button");Y.textContent="JSON",Y.classList.add("ytls-save-modal-button"),Y.onclick=()=>{x&&document.removeEventListener("keydown",x),T&&document.removeEventListener("click",T,!0),k(f,()=>Na("json"))()};let $=document.createElement("button");$.textContent="Plain Text",$.classList.add("ytls-save-modal-button"),$.onclick=()=>{x&&document.removeEventListener("keydown",x),T&&document.removeEventListener("click",T,!0),k(f,()=>Na("text"))()};let Z=document.createElement("button");Z.textContent="Cancel",Z.classList.add("ytls-save-modal-cancel-button"),Z.onclick=D,f.appendChild(v),f.appendChild(Y),f.appendChild($),f.appendChild(Z),document.body.appendChild(f),L(x),q(T)};let ur=document.createElement("button");ge(ur,"folder-open","Load"),ur.classList.add("ytls-file-operation-button"),ur.onclick=()=>{let f=document.createElement("div");f.id="ytls-load-modal",f.classList.remove("ytls-fade-out"),f.classList.add("ytls-fade-in");let v=document.createElement("p");v.textContent="Load from:";let x=null,T=null,D=k(f,()=>{x&&document.removeEventListener("keydown",x),T&&document.removeEventListener("click",T,!0)});x=b(D),T=O(f,D);let Y=document.createElement("button");Y.textContent="File",Y.classList.add("ytls-save-modal-button"),Y.onclick=()=>{let F=document.createElement("input");F.type="file",F.accept=".json,.txt",F.classList.add("ytls-hidden-file-input"),F.onchange=te=>{let de=te.target.files?.[0];if(!de)return;x&&document.removeEventListener("keydown",x),T&&document.removeEventListener("click",T,!0),D();let se=new FileReader;se.onload=()=>{let je=String(se.result).trim();Fa(je)},se.readAsText(de)},F.click()};let $=document.createElement("button");$.textContent="Clipboard",$.classList.add("ytls-save-modal-button"),$.onclick=async()=>{x&&document.removeEventListener("keydown",x),T&&document.removeEventListener("click",T,!0),k(f,async()=>{try{let F=await navigator.clipboard.readText();F?Fa(F.trim()):alert("Clipboard is empty.")}catch(F){d("Failed to read from clipboard: ",F,"error"),alert("Failed to read from clipboard. Ensure you have granted permission.")}})()};let Z=document.createElement("button");Z.textContent="Cancel",Z.classList.add("ytls-save-modal-cancel-button"),Z.onclick=D,f.appendChild(v),f.appendChild(Y),f.appendChild($),f.appendChild(Z),document.body.appendChild(f),L(x),q(T)};let gn=document.createElement("button");ge(gn,"file-export","Export"),gn.classList.add("ytls-file-operation-button"),gn.onclick=async()=>{try{await Kc()}catch{alert("Failed to export data: Could not read from database.")}};let dr=document.createElement("button");ge(dr,"file-import","Import"),dr.classList.add("ytls-file-operation-button"),dr.onclick=()=>{let f=document.createElement("input");f.type="file",f.accept=".json",f.classList.add("ytls-hidden-file-input"),f.onchange=v=>{let x=v.target.files?.[0];if(!x)return;let T=new FileReader;T.onload=()=>{try{let D=JSON.parse(String(T.result)),Y=[];for(let $ in D)if(Object.prototype.hasOwnProperty.call(D,$)&&$.startsWith("ytls-")){let Z=$.substring(5),F=D[$];if(F&&typeof F.video_id=="string"&&Array.isArray(F.timestamps)){let te=F.timestamps.map(se=>({...se,guid:se.guid||crypto.randomUUID()})),de=Ha(Z,te).then(()=>d(`Imported ${Z} to IndexedDB`)).catch(se=>d(`Failed to import ${Z} to IndexedDB:`,se,"error"));Y.push(de)}else d(`Skipping key ${$} during import due to unexpected data format.`,"warn")}Promise.all(Y).then(()=>{Ti()}).catch($=>{alert("An error occurred during import to IndexedDB. Check console for details."),d("Overall import error:",$,"error")})}catch(D){alert(`Failed to import data. Please ensure the file is in the correct format.
`+D.message),d("Import error:",D,"error")}},T.readAsText(x)},f.click()},a.onclick=f=>{Pa(f)},a.ontouchstart=f=>{Pa(f)},o.style.position="fixed",o.style.bottom="0",o.style.right="0",o.style.transition="none",Wr(),setTimeout(()=>cr(),10);let Qt=!1,Ro=0,Po=0,Rn=0,Oo=0,Q=0,ee=0,fe=null,ce=!1;o.addEventListener("mousedown",f=>{let v=f.target;if(!(v instanceof Element)||v instanceof HTMLInputElement||v instanceof HTMLTextAreaElement||v instanceof Element&&(v.closest("#ytls-playback-speed-group")||v.closest("#ytls-playback-speed"))||v!==s&&!s.contains(v)&&window.getComputedStyle(v).cursor==="pointer")return;Qt=!0,ce=!1;let x=o.getBoundingClientRect();Ro=f.clientX-x.left,Po=f.clientY-x.top,Rn=x.width,Oo=x.height,Q=document.documentElement.clientWidth,ee=document.documentElement.clientHeight,o.style.transition="none"}),document.addEventListener("mousemove",vo=f=>{if(!Qt)return;ce=!0;let v=f.clientX,x=f.clientY;fe===null&&(fe=requestAnimationFrame(()=>{if(fe=null,!Qt)return;let T=Math.max(0,Math.min(v-Ro,Q-Rn)),D=Math.max(0,Math.min(x-Po,ee-Oo));o.style.left=`${T}px`,o.style.top=`${D}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",yo=()=>{if(!Qt)return;Qt=!1,fe!==null&&(cancelAnimationFrame(fe),fe=null);let f=ce;setTimeout(()=>{ce=!1},50),cr(),setTimeout(()=>{f&&Bo()},200)}),o.addEventListener("dragstart",f=>f.preventDefault());let _e=document.createElement("div"),nt=document.createElement("div"),vt=document.createElement("div"),pr=document.createElement("div");_e.id="ytls-resize-tl",nt.id="ytls-resize-tr",vt.id="ytls-resize-bl",pr.id="ytls-resize-br";let Pn=!1,Ua=0,Ga=0,mr=0,fr=0,No=0,zo=0,qa=0,Za=0,hr=null,vn=null;Ho(_e,"top-left"),Ho(nt,"top-right"),Ho(vt,"bottom-left"),Ho(pr,"bottom-right"),document.addEventListener("mousemove",f=>{if(!Pn||!o||!vn)return;let v=f.clientX,x=f.clientY;hr===null&&(hr=requestAnimationFrame(()=>{if(hr=null,!Pn||!o||!vn)return;let T=v-Ua,D=x-Ga,Y=qa,$=Za,Z=mr,F=fr,te=No,de=zo;vn==="bottom-right"?(Z=Math.max(200,Math.min(800,mr+T)),F=Math.max(250,Math.min($,fr+D))):vn==="top-left"?(Z=Math.max(200,Math.min(800,mr-T)),te=No+T,F=Math.max(250,Math.min($,fr-D)),de=zo+D):vn==="top-right"?(Z=Math.max(200,Math.min(800,mr+T)),F=Math.max(250,Math.min($,fr-D)),de=zo+D):vn==="bottom-left"&&(Z=Math.max(200,Math.min(800,mr-T)),te=No+T,F=Math.max(250,Math.min($,fr+D))),te=Math.max(0,Math.min(te,Y-Z)),de=Math.max(0,Math.min(de,$-F)),o.style.width=`${Z}px`,o.style.height=`${F}px`,o.style.left=`${te}px`,o.style.top=`${de}px`,o.style.right="auto",o.style.bottom="auto"}))}),document.addEventListener("mouseup",()=>{Pn&&(Pn=!1,hr!==null&&(cancelAnimationFrame(hr),hr=null),vn=null,document.body.style.cursor="",ke(!0))});let $o=null;window.addEventListener("resize",bo=()=>{$o&&clearTimeout($o),$o=setTimeout(()=>{ke(!0),Fe?.(),$o=null},200)}),s.appendChild(c);let gr=document.createElement("span");gr.id="ytls-playback-speed-group",gr.style.display="inline-flex",gr.style.alignItems="center",gr.style.marginLeft="4px",u&&gr.appendChild(u),s.appendChild(gr),s.appendChild(m);let Si=document.createElement("div");Si.id="ytls-list-wrapper",it=document.createElement("div"),it.className="ytls-scrollbar-track",dn=document.createElement("div"),dn.className="ytls-scrollbar-thumb",it.append(dn),Si.append(a,it);let Fo=document.createElement("div");Fo.id="ytls-content",Fo.append(Si),Fo.append(p),o.append(s,Fo,_e,nt,vt,pr);let Wa="";o.addEventListener("mousemove",f=>{if(Qt||Pn)return;let v=o.getBoundingClientRect(),x=20,T=f.clientX,D=f.clientY,Y=T-v.left<=x,$=v.right-T<=x,Z=D-v.top<=x,F=v.bottom-D<=x,te="";Z&&Y||F&&$?te="nwse-resize":(Z&&$||F&&Y)&&(te="nesw-resize"),te!==Wa&&(Wa=te,document.body.style.cursor=te)});let Ei=null;if(it.addEventListener("mouseenter",()=>{_t&&(clearTimeout(_t),_t=null),it.classList.add("ytls-scrollbar-visible")}),it.addEventListener("mouseleave",()=>{mi||(_t=setTimeout(()=>{it?.classList.remove("ytls-scrollbar-visible"),_t=null},500))}),dn.addEventListener("mousedown",f=>{if(!a)return;f.preventDefault(),f.stopPropagation(),mi=!0;let v=f.clientY,x=a.scrollTop,{scrollHeight:T,clientHeight:D}=a,Y=Math.max(30,D/T*D),$=T-D,Z=D-Y;function F(de){if(!a)return;let se=de.clientY-v;a.scrollTop=Math.max(0,Math.min($,x+se*($/Z))),Ya()}function te(){mi=!1,document.removeEventListener("mousemove",F),document.removeEventListener("mouseup",te),it?.matches(":hover")||(_t=setTimeout(()=>{it?.classList.remove("ytls-scrollbar-visible"),_t=null},500))}document.addEventListener("mousemove",F),document.addEventListener("mouseup",te)}),o.addEventListener("mouseenter",()=>{ar=!0,ro(!0),Ka()}),a.addEventListener("scroll",Ka),o.addEventListener("mouseleave",()=>{!Pn&&!Qt&&(document.body.style.cursor=""),ar=!1,ro(!1);try{Ci()}catch{}try{Ct(!1)}catch{}}),Fe=jo,setTimeout(()=>{if(jo(),o&&s&&p&&a){let f=40,v=be();if(v.length>0)f=v[0].offsetHeight;else{let x=document.createElement("li");x.style.visibility="hidden",x.style.position="absolute",x.textContent="00:00 Example",a.appendChild(x),f=x.offsetHeight,a.removeChild(x)}B(s.offsetHeight+p.offsetHeight+f),o.style.minHeight=C()+"px"}},0),Mt){try{Mt.disconnect()}catch{}Mt=null}Mt=new ResizeObserver(jo),Mt.observe(o),Fr||document.addEventListener("pointerdown",Fr=()=>{_a=Date.now()},!0),jr||document.addEventListener("pointerup",jr=()=>{},!0)}finally{fi=!1}}}async function eu(){if(!o)return;if(document.querySelectorAll("#ytls-pane").forEach(h=>{h!==o&&(d("Removing duplicate pane element from DOM"),h.remove())}),document.body.contains(o)){d("Pane already in DOM, skipping append");return}await Xc(),lc(Wc),cc(Yc),ua(Do),da(xi),uc(bi),ic(R),await pa(),await xc(),await En(),fa();let m=document.querySelectorAll("#ytls-pane");if(m.length>0&&(d(`WARNING: Found ${m.length} existing pane(s) in DOM, removing all`),m.forEach(h=>h.remove())),document.body.contains(o)){d("ERROR: Pane already in body, aborting append");return}if(document.body.appendChild(o),d("Pane successfully appended to DOM"),Xe(),Ce&&(clearTimeout(Ce),Ce=null),Ce=setTimeout(()=>{Re(),Fe?.(),he(),ke(!0),Ce=null},450),At){try{At.disconnect()}catch{}At=null}At=new MutationObserver(()=>{let h=document.querySelectorAll("#ytls-pane");h.length>1&&(d(`CRITICAL: Multiple panes detected (${h.length}), removing duplicates`),h.forEach((w,E)=>{(E>0||o&&w!==o)&&w.remove()}))}),At.observe(document.body,{childList:!0})}function ja(l=0){if(document.getElementById("ytls-header-button")){Xt();return}let m=document.querySelector("#logo");if(!m||!m.parentElement){l<10&&setTimeout(()=>ja(l+1),300);return}let h=document.createElement("button");h.id="ytls-header-button",h.type="button",h.className="ytls-header-button",dt(h,"Toggle Timekeeper UI"),h.setAttribute("aria-label","Toggle Timekeeper UI");let w=document.createElement("img");w.src=St,w.alt="",w.decoding="async",h.appendChild(w),pn=w,h.addEventListener("mouseenter",()=>{pn&&(go=!0,pn.src=An)}),h.addEventListener("mouseleave",()=>{pn&&(go=!1,Xt())}),h.addEventListener("click",()=>{o&&!document.body.contains(o)&&(d("Pane not in DOM, re-appending before toggle"),document.body.appendChild(o)),ki()}),m.insertAdjacentElement("afterend",h),Xt(),d("Timekeeper header button added next to YouTube logo")}function Va(){if(Ee())return;we(!0);let l=history.pushState,m=history.replaceState;function h(){try{let w=new Event("locationchange");window.dispatchEvent(w)}catch{}}history.pushState=function(){let w=l.apply(this,arguments);return h(),w},history.replaceState=function(){let w=m.apply(this,arguments);return h(),w},window.addEventListener("popstate",h),window.addEventListener("locationchange",()=>{window.location.href!==N&&d("Location changed (locationchange event) \u2014 deferring UI update until navigation finish")})}async function Ti(){if(!i()){$c();return}ue(window.location.href),document.querySelectorAll("#ytls-pane").forEach((m,h)=>{(h>0||o&&m!==o)&&m.remove()}),await Mn(),await Qc(),Oe=wi();let l=document.title;d("Page Title:",l),d("Video ID:",Oe),d("Current URL:",window.location.href),vi(!0),Gr(),Qe(),await bi(),Qe(),vi(!1),d("Timestamps loaded and UI unlocked for video:",Oe),await eu();try{Ct(!0)}catch{}ja(),Vc()}Va(),window.addEventListener("yt-navigate-start",()=>{d("Navigation started (yt-navigate-start event fired)"),i()&&o&&a&&(d("Locking UI and showing loading state for navigation"),vi(!0))}),$r=l=>{if(!l.repeat&&!l.ctrlKey&&!l.altKey&&!l.metaKey&&!l.shiftKey&&(l.key==="z"||l.key==="Z")){if(Ac(l.target))return;wa()&&(l.preventDefault(),d("Playback speed toggled via keyboard shortcut (Z)"));return}l.ctrlKey&&l.altKey&&l.shiftKey&&(l.key==="T"||l.key==="t")&&(l.preventDefault(),ki(),d("Timekeeper UI toggled via keyboard shortcut (Ctrl+Alt+Shift+T)"))},document.addEventListener("keydown",$r),window.addEventListener("yt-navigate-finish",()=>{d("Navigation finished (yt-navigate-finish event fired)"),window.location.href!==N?Ti():d("Navigation finished but URL already handled, skipping.")}),Va(),d("Timekeeper initialized and waiting for navigation events")})();})();

